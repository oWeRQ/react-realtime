import io from 'socket.io-client';
import { useState, useReducer, useEffect, useRef, createElement } from 'react';
import deltaReducer from '../functions/deltaReducer';
import windowsReducer from '../functions/windowsReducer';
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
const reducer = deltaReducer(delta => socket.emit('delta', delta), windowsReducer);

export default function Home() {
  const [state, dispatch] = useReducer(reducer, {});
  const action = type => payload => dispatch({ type, payload });

  useEffect(() => {
    async function socketInitializer() {
      await fetch('/api/socket');

      socket = io();
      socket.on('init', action('init'));
      socket.on('delta', action('delta'));
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

  const addWindow = action('addWindow');
  const updateWindow = action('updateWindow');
  const closeWindow = action('closeWindow');
  const focusWindow = action('focusWindow');

  const isActive = (win) => {
    return win.id === activeWindow?.id;
  }

  const openWindow = (app) => {
    const id = uniqId();
    const [left, top] = activeWindow?.position || [0, 0];

    addWindow({
      id,
      appId: app.id,
      state: {},
      title: app.name,
      position: [left + 14, top + 14],
      size: [300, 300],
    });
  }

  const startRef = useRef();
  const [start, setStart] = useState(false);
  const toggleStart = () => {
    setStart(val => !val);
  }

  const appComponent = ({ id, appId, state }) => {
    const setState = (nextState) => {
      if (typeof nextState === 'function') {
        nextState = nextState(state);
      }

      updateWindow({ id, state: nextState });
    };

    return createElement(appsById.get(appId).component, { state, setState });
  }

  return (
    <RDesktop>
      {windows.map(win =>
        <RWindow
          key={win.id}
          onClose={() => closeWindow({ id: win.id })}
          onFocus={() => focusWindow({ id: win.id })}
          position={win.position}
          setPosition={position => updateWindow({ id: win.id, position })}
          size={win.size}
          setSize={size => updateWindow({ id: win.id, size })}
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