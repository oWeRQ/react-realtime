import { useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import useReferencePlace from '../hooks/useReferencePlace';
import styles from './RMenu.module.css';

export default function RMenu({ children, reference, placement, onClose }) {
  const ref = useRef();
  const style = useReferencePlace(reference, ref, placement);
  useClickOutside(ref, onClose);

  return (
    <div ref={ref} className={styles.container} style={style} onClick={onClose}>
      {children}
    </div>
  );
}