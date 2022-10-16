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
    case 'position':
      return { ...state, windows: state.windows.map(win => (win.id === payload.id ? { ...win, position: payload.position } : win)) };
    case 'size':
      return { ...state, windows: state.windows.map(win => (win.id === payload.id ? { ...win, size: payload.size } : win)) };
    case 'state':
      return { ...state, windows: state.windows.map(win => (win.id === payload.id ? { ...win, state: payload.state } : win)) };
    case 'addWindow':
      return { ...state, windows: addWindow(state.windows || [], payload) };
    case 'closeWindow':
      return { ...state, windows: state.windows.filter(win => win.id !== payload.id) };
    case 'focusWindow':
      return { ...state, windows: focusWindow(state.windows, payload) };
  }

  return state;
}