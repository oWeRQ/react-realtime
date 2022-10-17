export default function messagesReducer(state, { type, payload }) {
  switch (type) {
    case 'addMessage':
      return { ...state, messages: [...(state.messages || []), payload] };
  }

  return state;
}