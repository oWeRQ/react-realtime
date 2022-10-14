import { useCallback, useRef, useState } from 'react';
import clsx from '../functions/clsx';
import listenPointerMove from '../functions/listenPointerMove';
import styles from './RWindow.module.css';

export default function RWindow({ title, position: [left, top], setPosition, size: [width, height], setSize, children }) {
  const [isMove, setIsMove] = useState(false);
  const headerRef = useRef();
  const offsetRef = useRef([0, 0]);

  const onMove = useCallback((e) => {
    const [offsetLeft, offsetTop] = offsetRef.current;
    setPosition([e.clientX - offsetLeft, e.clientY - offsetTop]);
  }, [setPosition]);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsMove(true);
    offsetRef.current = [e.clientX - left, e.clientY - top];
    listenPointerMove(document, onMove, () => setIsMove(false));
  }, [setIsMove, onMove, left, top]);

  return (
    <div className={styles.container} style={{ left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px' }}>
      <div className={clsx({ [styles.header]: true, [styles.move]: isMove })} ref={headerRef} onMouseDown={onMouseDown}>
        <div className={styles.title}>{title}</div>
        <div className={styles.close}>&times;</div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      <div className={styles.resize}></div>
    </div>
  );
}