import { createElement, memo, useCallback, useRef } from 'react';
import { appsById } from '../apps';

export default memo(function RApp({ id, appId, state, updateWindow }) {
  const stateRef = useRef();
  stateRef.current = state;

  const setState = useCallback((nextState) => {
    if (typeof nextState === 'function') {
      nextState = nextState(stateRef.current);
    }

    updateWindow({ id, state: nextState });
  }, [id, updateWindow]);

  return createElement(appsById.get(appId).component, { state, setState });
});