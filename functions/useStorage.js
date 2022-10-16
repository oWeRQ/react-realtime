import { useState, useCallback, useEffect } from 'react';

function storageGet(key) {
  try {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue) {
      return JSON.parse(jsonValue);
    }
  } catch (e) {}
}

function storageSet(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
    return value;
  } catch (e) {}
}

export default function useStorage(key, value) {
  const [state, setState] = useState(storageGet(key) ?? storageSet(key, value));

  useEffect(() => {
    const listener = e => {
      if (e.key === key) {
        setState(storageGet(key));
      }
    };

    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key, setState]);

  const setter = useCallback(value => {
    storageSet(key, value);

    window.dispatchEvent(new StorageEvent('storage', {
      key,
    }));
  }, [key]);

  return [state, setter];
}