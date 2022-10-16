import io from 'socket.io-client';
import { useState, useReducer, useEffect, useRef, createElement } from 'react';
import mergeReducers from '../functions/mergeReducers';
import deltaReducer from '../functions/deltaReducer';
import windowsReducer from '../functions/windowsReducer';
import messagesReducer from '../functions/messagesReducer';
import RDesktop from '../components/RDesktop';
import RTaskBar from '../components/RTaskBar';
import RButton from '../components/RButton';
import RMenu from '../components/RMenu';
import RMenuItem from '../components/RMenuItem';
import RWindow from '../components/RWindow';
import getMax from '../functions/getMax';
import uniqId from '../functions/uniqId';
import apps, { appsById } from '../apps';

let socket;
const reducer = deltaReducer(delta => socket.emit('delta', delta), mergeReducers(windowsReducer, messagesReducer));
const initialState = {};

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

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


  const windows = state.windows ?? [];
  const activeWindow = getMax(windows, win => win.zIndex);

  const isActive = (win) => {
    return win.id === activeWindow?.id;
  }

  const openWindow = (app) => {
    const id = uniqId();
    const [left, top] = activeWindow?.position || [0, 0];

    dispatch({
      type: 'addWindow',
      payload: {
        id,
        appId: app.id,
        state: {},
        title: `${app.name} [${id}]`,
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

  const setPosition = ({ id }, position) => {
    dispatch({
      type: 'position',
      payload: { id, position },
    });
  };

  const setSize = ({ id }, size) => {
    dispatch({
      type: 'size',
      payload: { id, size },
    });
  };

  const startRef = useRef();
  const [start, setStart] = useState(false);
  const toggleStart = () => {
    setStart(val => !val);
  }

  const appComponent = ({ id, appId, state }) => {
    const setState = (state) => {
      dispatch({
        type: 'state',
        payload: {
          id,
          state,
        },
      });
    };

    return createElement(appsById.get(appId).component, { state, setState });
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
          {appComponent(win)}
        </RWindow>
       )}
      <RTaskBar>
        {start && <RMenu reference={startRef} placement="top-start" onClose={() => setStart(false)}>
          {apps.map(app =>
            <RMenuItem key={app.id} onClick={() => openWindow(app)}>{app.name}</RMenuItem>
          )}
        </RMenu>}
        <RButton ref={startRef} bold active={start} onClick={toggleStart}>Start</RButton>
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