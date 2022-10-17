import { useCallback } from 'react';
import useSocketReducer from '../hooks/useSocketReducer';
import windowsReducer from '../reducers/windowsReducer';
import getMax from '../functions/getMax';
import uniqId from '../functions/uniqId';
import RApp from './RApp';
import RDesktop from './RDesktop';
import RTaskBar from './RTaskBar';
import RButton from './RButton';
import RStart from './RStart';
import RWindow from './RWindow';

export default function RRoot() {
  const [state, dispatch] = useSocketReducer('/api/socket', windowsReducer);

  const windows = state.windows ?? [];
  const activeWindow = getMax(windows, win => win.zIndex);
  const isActive = win => win.id === activeWindow?.id;

  const updateWindow = useCallback(payload => {
    dispatch({ type: 'updateWindow', payload });
  }, [dispatch]);

  const setPosition = win => position => dispatch({ type: 'updateWindow', payload: { id: win.id, position } });
  const setSize = win => size => dispatch({ type: 'updateWindow', payload: { id: win.id, size } });
  const onClose = win => () => dispatch({ type: 'closeWindow', payload: { id: win.id } });
  const onFocus = win => () => dispatch({ type: 'focusWindow', payload: { id: win.id } });

  const openApp = app => {
    const id = uniqId();
    const [left, top] = activeWindow?.position || [0, 0];

    dispatch({
      type: 'addWindow',
      payload: {
        id,
        appId: app.id,
        state: {},
        title: app.name,
        position: [left + 14, top + 14],
        size: [300, 300],
      },
    });
  };

  return (
    <RDesktop>
      {windows.map(win =>
        <RWindow
          key={win.id}
          title={win.title}
          zIndex={win.zIndex}
          position={win.position}
          size={win.size}
          active={isActive(win)}
          onClose={onClose(win)}
          onFocus={onFocus(win)}
          setPosition={setPosition(win)}
          setSize={setSize(win)}
        >
          <RApp
            id={win.id}
            appId={win.appId}
            state={win.state}
            updateWindow={updateWindow}
          />
        </RWindow>
      )}
      <RTaskBar>
        <RStart openApp={openApp} />
        {windows.map(win =>
          <RButton
            key={win.id}
            onClick={onFocus(win)}
            active={isActive(win)}
            bold={isActive(win)}
          >{win.title}</RButton>
        )}
      </RTaskBar>
    </RDesktop>
  );
}