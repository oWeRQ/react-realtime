import { useCallback } from 'react';
import useSocketReducer from '../hooks/useSocketReducer';
import windowsReducer from '../reducers/windowsReducer';
import RApp from '../components/RApp';
import RDesktop from '../components/RDesktop';
import RTaskBar from '../components/RTaskBar';
import RButton from '../components/RButton';
import RStart from '../components/RStart';
import RWindow from '../components/RWindow';
import getMax from '../functions/getMax';
import uniqId from '../functions/uniqId';

export default function Home() {
  const [state, dispatch] = useSocketReducer('/api/socket', windowsReducer);
  const useAction = (type) => useCallback((payload) => dispatch({ type, payload }), [type]);

  const addWindow = useAction('addWindow');
  const updateWindow = useAction('updateWindow');
  const closeWindow = useAction('closeWindow');
  const focusWindow = useAction('focusWindow');

  const windows = state.windows ?? [];
  const activeWindow = getMax(windows, win => win.zIndex);
  const isActive = win => win.id === activeWindow?.id;

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