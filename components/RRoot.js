import { useCallback } from 'react';
import useSocketReducer from '../hooks/useSocketReducer';
import windowsReducer from '../reducers/windowsReducer';
import getMax from '../functions/getMax';
import uniqId from '../functions/uniqId';
import RDesktop from './RDesktop';
import RTaskBar from './RTaskBar';
import RStart from './RStart';
import RWindowList from './RWindowList';
import RWindowStack from './RWindowStack';

export default function RRoot() {
  const [state, dispatch] = useSocketReducer('/api/socket', windowsReducer);

  const windows = state.windows ?? [];
  const activeWindow = getMax(windows, win => win.zIndex);
  const isActive = id => id === activeWindow?.id;

  const updateWindow = useCallback(payload => {
    dispatch({ type: 'updateWindow', payload });
  }, [dispatch]);

  const closeWindow = useCallback(id => () => {
    dispatch({ type: 'closeWindow', payload: { id } });
  }, [dispatch]);

  const focusWindow = useCallback(id => () => {
    dispatch({ type: 'focusWindow', payload: { id } });
  }, [dispatch]);

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
      <RWindowStack
        windows={windows}
        isActive={isActive}
        focusWindow={focusWindow}
        closeWindow={closeWindow}
        updateWindow={updateWindow}
      />
      <RTaskBar>
        <RStart openApp={openApp} />
        <RWindowList
          windows={windows}
          isActive={isActive}
          focusWindow={focusWindow}
        />
      </RTaskBar>
    </RDesktop>
  );
}