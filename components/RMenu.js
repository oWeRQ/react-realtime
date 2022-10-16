import { useEffect, useRef, useState } from 'react';
import getReferencePlace from '../functions/getReferencePlace';
import styles from './RMenu.module.css';

export default function RMenu({ children, reference, placement, onClose }) {
  const ref = useRef();
  const [style, setStyle] = useState();

  useEffect(() => {
    const place = getReferencePlace(reference.current, ref.current, placement);
    setStyle({
      left: place.left + 'px',
      top: place.top + 'px',
    });
  }, [reference, placement]);

  return (
    <div ref={ref} className={styles.container} style={style}>
      {children}
    </div>
  );
}