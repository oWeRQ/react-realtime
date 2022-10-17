import io from 'socket.io-client';
import { useReducer, useEffect, useCallback } from 'react';
import deltaReducer from '../functions/deltaReducer';
import windowsReducer from '../functions/windowsReducer';
import RApp from '../components/RApp';
import RDesktop from '../components/RDesktop';
import RTaskBar from '../components/RTaskBar';
import RButton from '../components/RButton';
import RStart from '../components/RStart';
import RWindow from '../components/RWindow';
import getMax from '../functions/getMax';
import uniqId from '../functions/uniqId';

let socket;
const reducer = deltaReducer(delta => socket.emit('delta', delta), windowsReducer);

export default function Home() {
  const [state, dispatch] = useReducer(reducer, {});
  const useAction = (type) => useCallback((payload) => dispatch({ type, payload }), [type]);

  const init = useAction('init');
  const delta = useAction('delta');
  const addWindow = useAction('addWindow');
  const updateWindow = useAction('updateWindow');
  const closeWindow = useAction('closeWindow');
  const focusWindow = useAction('focusWindow');

  useEffect(() => {
    async function socketInitializer() {
      await fetch('/api/socket');

      socket = io();
      socket.on('init', init);
      socket.on('delta', delta);
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.off();
        socket.disconnect();
      }
    };
  }, [init, delta]);

  const windows = state.windows ?? [];
  const activeWindow = getMax(windows, win => win.zIndex);

  const isActive = (win) => {
    return win.id === activeWindow?.id;
  }

  const openApp = (app) => {
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
          <RApp id={win.id} appId={win.appId} state={win.state} updateWindow={updateWindow} />
        </RWindow>
      )}
      <RTaskBar>
        <RStart openApp={openApp} />
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