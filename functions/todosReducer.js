export default function todosReducer(state, { type, payload }) {
  switch (type) {
    case 'createTodo':
      return { ...state, todos: [ ...(state.todos || []), payload ] };
    case 'updateTodo':
      return { ...state, todos: state.todos.map(todo => todo.id === payload.id ? { ...todo, ...payload } : todo) };
    case 'removeTodo':
      return { ...state, todos: state.todos.filter(todo => todo.id !== payload.id) };
    case 'clearTodos':
      return { ...state, todos: state.todos.filter(todo => !todo.done) };
  }

  return state;
}