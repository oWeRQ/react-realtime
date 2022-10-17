import { useState, useRef } from 'react';
import RButton from '../components/RButton';
import RMenu from '../components/RMenu';
import RMenuItem from '../components/RMenuItem';
import apps from '../apps';

export default function RStart({ openApp }) {
  const startRef = useRef();
  const [start, setStart] = useState(false);
  const toggleStart = () => {
    setStart(val => !val);
  }

  return (
    <>
      {start && <RMenu reference={startRef} placement="top-start" onClose={() => setStart(false)}>
        {apps.map(app =>
          <RMenuItem key={app.id} onClick={() => openApp(app)}>{app.name}</RMenuItem>
        )}
      </RMenu>}
      <RButton ref={startRef} bold active={start} onClick={toggleStart}>Start</RButton>
    </>
  );
}