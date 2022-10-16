import RTextArea from '../components/RTextArea';

export default function Note({ data, onData }) {
  return (
    <RTextArea value={data.value ?? ''} onChange={value => onData({ value })} monospace style={{ background: '#ffff60' }} />
  );
}