import { useRef } from 'react';
import RTextArea from '../components/RTextArea';

export default function Note({ state, setState }) {
  const ref = useRef();

  const onChange = value => {
    setState(state => ({ ...state, value }));
  };

  const onSelection = selection => {
    setState(state => ({ ...state, selection }));
  };

  return (
    <RTextArea
      ref={ref}
      value={state.value ?? ''}
      onChange={onChange}
      onSelection={onSelection}
      selection={state.selection}
      monospace
      style={{ background: '#ffff60' }}
    />
  );
}