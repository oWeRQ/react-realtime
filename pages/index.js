import io from 'socket.io-client';
import { useState, useReducer, useEffect } from 'react';
import socketReducer from '../functions/socketReducer';
import RDesktop from '../components/RDesktop';
import RWindow from '../components/RWindow';

let socket;

const initialState = {};

const reducer = socketReducer(() => socket, (state, { type, payload }) => {
  switch (type) {
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

  const [position, setPosition] = useState([100, 100]);
  const [size, setSize] = useState([300, 300]);

  return (
    <RDesktop>
      <RWindow position={position} setPosition={setPosition} size={size} setSize={setSize} title="Chat">
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
    </RDesktop>
  );
}