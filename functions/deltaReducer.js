import { create as createDiffPatcher, patch, clone } from 'jsondiffpatch';

const diffPatcher = createDiffPatcher({
  objectHash,
  textDiff: {
    minLength: 1,
  },
});

function objectHash(obj, index) {
  return obj.id || '$$index:' + index;
}

export default function deltaReducer(reducer, emit) {
  return (state, action) => {
    if (action?.type === 'init') {
      return { ...state, ...action?.payload };
    }

    if (action?.type === 'delta') {
      return patch(clone(state), action?.payload);
    }

    const nextState = reducer(state, action);
    const delta = diffPatcher.diff(state, nextState);
    emit(delta);
    return nextState;
  };
}