import RTextArea from '../components/RTextArea';

export default function Note({ state, setState }) {
  return (
    <RTextArea value={state.value ?? ''} onChange={value => setState({ value })} monospace style={{ background: '#ffff60' }} />
  );
}