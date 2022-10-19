import RTextArea from '../components/RTextArea';

export default function Note({ state, setState }) {
  const onChange = value => {
    setState(state => ({ ...state, value }));
  };

  const onSelection = selection => {
    setState(state => ({ ...state, selection }));
  };

  return (
    <RTextArea
      value={state.value ?? ''}
      onChange={onChange}
      onSelection={onSelection}
      selection={state.selection}
      monospace
      style={{ background: '#ffff60' }}
    />
  );
}