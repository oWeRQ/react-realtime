export default function mergeReducers(...reducers) {
  return (state, action) => {
    for (const reducer of reducers) {
      state = reducer(state, action);
    }
    return state;
  };
}