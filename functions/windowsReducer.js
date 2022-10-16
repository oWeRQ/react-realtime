import getMax from './getMax';

function getZIndex(windows) {
  return getMax(windows, win => win.zIndex)?.zIndex ?? 0;
}

function addWindow(windows, win) {
  const zIndex = getZIndex(windows) + 1;
  return [...windows, { ...win, zIndex }];
}

function focusWindow(windows, { id }) {
  const zIndex = getZIndex(windows);
  const oldZIndex = windows.find(w => w.id === id).zIndex;

  return windows.map(w => {
    if (w.zIndex < oldZIndex) {
      return w;
    } else if (w.id === id) {
      return { ...w, zIndex };
    } else {
      return { ...w, zIndex: w.zIndex - 1 };
    }
  });
}

export default function windowsReducer(state, { type, payload }) {
  switch (type) {
    case 'addWindow':
      return { ...state, windows: addWindow(state.windows || [], payload) };
    case 'updateWindow':
      return { ...state, windows: state.windows.map(win => (win.id === payload.id ? { ...win, ...payload } : win)) };
    case 'closeWindow':
      return { ...state, windows: state.windows.filter(win => win.id !== payload.id) };
    case 'focusWindow':
      return { ...state, windows: focusWindow(state.windows, payload) };
  }

  return state;
}