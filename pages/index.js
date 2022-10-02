import io from 'socket.io-client';
import { useState, useReducer, useEffect } from 'react';
import { create as createDiffPatcher, patch, clone } from 'jsondiffpatch';

let socket;

const diffPatcher = createDiffPatcher({
  objectHash,
  textDiff: {
    minLength: 1,
  },
});

function objectHash(obj, index) {
  return obj.id || '$$index:' + index;
}

function socketReducer(reducer) {
  return (state, action) => {
    const nextState = reducer(state, action);

    if (action?.type !== 'init' && action?.type !== 'delta') {
      const delta = diffPatcher.diff(state, nextState);
      socket.emit('delta', delta);
    }

    return nextState;
  };
}

const initialState = {};

const reducer = socketReducer((state, { type, payload }) => {
  switch (type) {
    case 'init':
      return { ...state, ...payload };
    case 'delta':
      return patch(clone(state), payload);
    case 'addMessage':
      return { ...state, messages: [...(state.messages || []), payload] };
  }

  return state;
});

export default function Home() {
  const [author, setAuthor] = useState('Guest');
  const [message, setMessage] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const messages = state.messages || [];

  useEffect(() => {
    async function socketInitializer() {
      await fetch('/api/socket');

      socket = io();

      socket.on('init', (payload) => {
        dispatch({
          type: 'init',
          payload,
        });
      });

      socket.on('delta', (payload) => {
        dispatch({
          type: 'delta',
          payload,
        });
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.off();
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = async () => {
    const payload = { author, message };
    dispatch({
      type: 'addMessage',
      payload,
    });
    setMessage('');
  };

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };

  return (
    <>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            {msg.author}: {msg.message}
          </li>
        ))}
      </ul>
      <input
        size="4"
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      :
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleKeypress}
      />
      <button onClick={sendMessage}>Send</button>
    </>
  );
}