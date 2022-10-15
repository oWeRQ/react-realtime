import io from 'socket.io-client';
import { useState, useReducer, useEffect } from 'react';
import socketReducer from '../functions/socketReducer';
import RDesktop from '../components/RDesktop';
import RTaskBar from '../components/RTaskBar';
import RButton from '../components/RButton';
import RWindow from '../components/RWindow';
import uniqId from '../functions/uniqId';

function getMax(arr, mapper = v => v) {
  let max = -Infinity;
  let result = undefined;

  for (let item of arr) {
    const value = mapper(item);
    if (max < value) {
      max = value;
      result = item;
    }
  }

  return result;
}

function addWindow(windows, win) {
  const zIndex = windows.length ? getMax(windows, win => win.zIndex).zIndex + 1 : 1;
  return [...windows, { ...win, zIndex }];
}

function focusWindow(windows, { id }) {
  const zIndex = getMax(windows, w => w.zIndex).zIndex;
  const oldZIndex = windows.find(w => w.id === id).zIndex;

  return windows.map(w => {
    if (w.zIndex < oldZIndex) {
      return w;
    } else if (w.id === id) {
      return { ...w, zIndex };
    } else {
      return { ...w, zIndex: w.zIndex - 1 };
    }
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
      return { ...state, windows: addWindow(state.windows || [], payload) };
    case 'closeWindow':
      return { ...state, windows: state.windows.filter(win => win.id !== payload.id) };
    case 'focusWindow':
      return { ...state, windows: focusWindow(state.windows, payload) };
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
            onClick={() => focusWindow(win)}
            active={isActive(win)}
            bold={isActive(win)}
          >{win.title}</RButton>
        )}
      </RTaskBar>
    </RDesktop>
  );
}