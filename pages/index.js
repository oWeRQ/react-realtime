import io from 'socket.io-client';
import { useState, useReducer, useEffect } from 'react';
import mergeReducers from '../functions/mergeReducers';
import deltaReducer from '../functions/deltaReducer';
import windowsReducer from '../functions/windowsReducer';
import messagesReducer from '../functions/messagesReducer';
import RDesktop from '../components/RDesktop';
import RTaskBar from '../components/RTaskBar';
import RButton from '../components/RButton';
import RWindow from '../components/RWindow';
import useStorage from '../functions/useStorage';
import getMax from '../functions/getMax';
import uniqId from '../functions/uniqId';

let socket;
const reducer = deltaReducer(delta => socket.emit('delta', delta), mergeReducers(windowsReducer, messagesReducer));
const initialState = {};

export default function Home() {
  const [author, setAuthor] = useStorage('username', 'Guest ' + uniqId());
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
  const setPosition = ({ id }, position) => {
    dispatch({
      type: 'position',
      payload: { id, position },
    });
  };

  const size = state.size ?? [300, 300];
  const setSize = ({ id }, size) => {
    dispatch({
      type: 'size',
      payload: { id, size },
    });
  };

  const windows = state.windows ?? [];
  const activeWindow = getMax(windows, win => win.zIndex);
  const openWindow = () => {
    const id = uniqId();
    const [left, top] = activeWindow?.position || [0, 0];

    dispatch({
      type: 'addWindow',
      payload: {
        id,
        title: `Chat ${id}`,
        position: [left + 14, top + 14],
        size: [300, 300],
      },
    });
  }
  const closeWindow = ({ id }) => {
    dispatch({
      type: 'closeWindow',
      payload: {
        id,
      },
    });
  }
  const focusWindow = ({ id }) => {
    dispatch({
      type: 'focusWindow',
      payload: {
        id,
      },
    });
  }

  function isActive(win) {
    return win.id === activeWindow?.id;
  }

  return (
    <RDesktop>
      {windows.map(win =>
        <RWindow
          key={win.id}
          onClose={() => closeWindow(win)}
          onFocus={() => focusWindow(win)}
          position={win.position}
          setPosition={value => setPosition(win, value)}
          size={win.size}
          setSize={value => setSize(win, value)}
          title={win.title}
          zIndex={win.zIndex}
          active={isActive(win)}
        >
          <ul>
            {messages.map((msg, i) => (
              <li key={i}>
                {msg.author}: {msg.message}
              </li>
            ))}
          </ul>
          <input
            size="8"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          :
          <input
            size="16"
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
            onClick={() => focusWindow(win)}
            active={isActive(win)}
            bold={isActive(win)}
          >{win.title}</RButton>
        )}
      </RTaskBar>
    </RDesktop>
  );
}