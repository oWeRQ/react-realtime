import { useState, useCallback } from 'react';

function storageGet(key, value) {
  try {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue) {
      return JSON.parse(jsonValue);
    }
  } catch (e) {}

  storageSet(key, value);
  return value;
}

function storageSet(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    return false;
  }
}

export default function useStorage(key, value) {
  const [state, setState] = useState(storageGet(key, value));

  const setter = useCallback(value => {
    setState(value);
    storageSet(key, value);
  }, [key]);

  return [state, setter];
}