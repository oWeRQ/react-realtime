import io from 'socket.io-client';
import { useState, useReducer, useEffect } from 'react';
import socketReducer from '../functions/socketReducer';
import RDesktop from '../components/RDesktop';
import RTaskBar from '../components/RTaskBar';
import RButton from '../components/RButton';
import RWindow from '../components/RWindow';
import uniqId from '../functions/uniqId';

function focusWindow(id, windows) {
  return [...windows].sort((a, b) => {
    if (a.id === id)
      return 1;
    else if (b.id === id)
      return -1;

    return 0;
  });
}

let socket;

const initialState = {};

const reducer = socketReducer(() => socket, (state, { type, payload }) => {
  switch (type) {
    case 'addMessage':
      return { ...state, messages: [...(state.messages || []), payload] };
    case 'position':
      return { ...state, windows: state.windows.map(win => (win.id === payload.id ? { ...win, position: payload.position } : win)) };
    case 'size':
      return { ...state, windows: state.windows.map(win => (win.id === payload.id ? { ...win, size: payload.size } : win)) };
    case 'addWindow':
      return { ...state, windows: [...(state.windows || []), payload] };
    case 'focusWindow':
      return state.windows.at(-1).id === payload.id ? state : { ...state, windows: focusWindow(payload.id, state.windows) };
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

  const position = state.position ?? [100, 100];
  const setPosition = (id, position) => {
    dispatch({
      type: 'position',
      payload: { id, position },
    });
  };

  const size = state.size ?? [300, 300];
  const setSize = (id, size) => {
    dispatch({
      type: 'size',
      payload: { id, size },
    });
  };

  const [activeId, setActiveId] = useState(0);
  const windows = state.windows ?? [];
  const openWindow = () => {
    const id = uniqId();

    dispatch({
      type: 'addWindow',
      payload: {
        id,
        title: `Chat ${id}`,
        position: [100, 100],
        size: [300, 300],
      },
    });
  }
  const focusWindow = (id) => {
    setActiveId(id);

    dispatch({
      type: 'focusWindow',
      payload: {
        id,
      },
    });
  }

  return (
    <RDesktop>
      {windows.map(win =>
        <RWindow
          key={win.id}
          onFocus={() => focusWindow(win.id)}
          position={win.position}
          setPosition={value => setPosition(win.id, value)}
          size={win.size}
          setSize={value => setSize(win.id, value)}
          title={win.title}
          active={win.id === activeId}
        >
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
        </RWindow>
       )}
      <RTaskBar>
        <RButton bold onClick={openWindow}>Start</RButton>
        {windows.map(win =>
          <RButton
            key={win.id}
            onClick={() => focusWindow(win.id)}
            active={win.id === activeId}
            bold
          >{win.title}</RButton>
        )}
      </RTaskBar>
    </RDesktop>
  );
}