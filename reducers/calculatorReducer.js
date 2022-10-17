function opReducer(state, { type, payload }) {
  switch (type) {
    case '/':
      return state / payload;
    case '*':
      return state * payload;
    case '-':
      return state - payload;
    case '+':
      return state + payload;
  }

  return payload;
}

export default function calculatorReducer(state, { type, payload }) {
  switch (type) {
    case 'num':
      return {
        ...state,
        value: (!+state.value ? '' : state.value) + String(payload),
      };
    case 'sign':
      return {
        ...state,
        value: String(-+state.value),
      };
    case 'dot':
      return {
        ...state,
        value: state.value.replace(/\./g, '') + '.',
      };
    case 'back':
      return {
        ...state,
        value: state.value.slice(0, -1) || '0',
      };
    case 'clear':
      return {
        ...state,
        value: '0',
      };
    case 'op':
      return {
        ...state,
        prev: String(opReducer(+state.prev, { type: state.op, payload: +state.value })),
        op: payload,
        value: '0',
      };
    case 'sqrt':
      return {
        ...state,
        prev: '0',
        op: null,
        value: String(Math.sqrt(+state.value)),
      };
    case 'calc':
      return {
        ...state,
        prev: '0',
        op: null,
        value: String(opReducer(+state.prev, { type: state.op, payload: +state.value })),
      };
  }

  return state;
}