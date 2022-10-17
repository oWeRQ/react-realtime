import { useState } from 'react';
import RButton from '../components/RButton';
import RInput from '../components/RInput';
import RCheckbox from '../components/RCheckbox';
import clsx from '../functions/clsx';
import uniqId from '../functions/uniqId';
import todosReducer from '../reducers/todosReducer';
import styles from './ToDo.module.css';

export default function ToDo({ state, setState }) {
  const dispatch = action => {
    setState(state => todosReducer(state, action));
  };

  const todos = state.todos || [];
  const leftCount = todos.filter(todo => !todo.done).length;
  const status = `${leftCount} items left`;

  const [text, setText] = useState('');

  const add = () => {
    if (!text)
      return;

    dispatch({
      type: 'createTodo',
      payload: { id: uniqId(), done: false, text },
    });
    setText('');
  };

  const toggle = todo => {
    dispatch({
      type: 'updateTodo',
      payload: { id: todo.id, done: !todo.done },
    });
  };

  const remove = todo => {
    dispatch({
      type: 'removeTodo',
      payload: { id: todo.id },
    });
  };

  const handleKeypress = e => {
    if (e.keyCode === 13) {
      add();
    }
  };

  const renderTodo = todo => (
    <div key={todo.id} className={clsx(styles.todo, { [styles.done]: todo.done })}>
      <RCheckbox onChange={() => toggle(todo)} checked={todo.done} />
      <div className={styles.todoText}>{todo.text}</div>
      <span className={styles.todoRemove} onClick={() => remove(todo)}>&times;</span>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.todoList}>
          {todos.map(renderTodo)}
        </div>
      </div>
      <div className={styles.footer}>
        <RInput
          placeholder="ToDo"
          className={styles.textInput}
          value={text}
          onChange={setText}
          onKeyUp={handleKeypress}
        />
        <RButton className={styles.add} onClick={add}>Add</RButton>
      </div>
      <div className={styles.statusBar}>
        {status}
      </div>
    </div>
  );
}