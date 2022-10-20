import RTextArea from '../components/RTextArea';
import styles from './Note.module.css';

export default function Note({ state, setState }) {
  const onChange = value => {
    setState(state => ({ ...state, value }));
  };

  const onSelection = selection => {
    setState(state => ({ ...state, selection }));
  };

  return (
    <RTextArea
      className={styles.container}
      value={state.value ?? ''}
      onChange={onChange}
      onSelection={onSelection}
      selection={state.selection}
      monospace
    />
  );
}