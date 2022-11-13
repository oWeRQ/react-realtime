import io from 'socket.io-client';
import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import deltaReducer from '../functions/deltaReducer';

export default function useSocketReducer(url, code, reducer, initializerArg = {}) {
  const [socket, setSocket] = useState();
  const socketReducer = useMemo(() => deltaReducer(reducer, delta => socket?.emit('delta', delta)), [reducer, socket]);
  const [state, dispatch] = useReducer(socketReducer, initializerArg);
  const init = useCallback(payload => dispatch({ type: 'init', payload }), []);
  const delta = useCallback(payload => dispatch({ type: 'delta', payload }), []);

  useEffect(() => {
    async function socketInitializer() {
      await fetch(url);

      const socket = io();
      socket.on('init', init);
      socket.on('delta', delta);
      socket.on('connect', () => {
        socket.emit('code', code);
      });
      setSocket(socket);
      return socket;
    };

    const socketPromise = socketInitializer();

    return async () => {
      const socket = await socketPromise;
      socket.off();
      socket.disconnect();
    };
  }, [url, init, delta, code]);

  return [state, dispatch];
}