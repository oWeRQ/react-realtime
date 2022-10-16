import { useCallback, useRef, useState } from 'react';
import clsx from '../functions/clsx';
import listenPointerMove from '../functions/listenPointerMove';
import RButton from './RButton';
import styles from './RWindow.module.css';

export default function RWindow({ onClose, onFocus, zIndex, active, title, position: [left, top], setPosition, size: [width, height], setSize, children }) {
  const [isMove, setIsMove] = useState(false);
  const headerRef = useRef();
  const offsetRef = useRef([0, 0]);
  const sizeRef = useRef([0, 0]);

  const onMove = useCallback((e) => {
    const [offsetLeft, offsetTop] = offsetRef.current;
    setIsMove(true);
    setPosition([e.clientX - offsetLeft, e.clientY - offsetTop]);
  }, [setPosition]);

  const onStartMove = useCallback((e) => {
    offsetRef.current = [e.clientX - left, e.clientY - top];
    listenPointerMove(document, onMove, () => setIsMove(false));
  }, [onMove, left, top]);

  const onResize = useCallback((e) => {
    const [width, height] = sizeRef.current;
    setSize([e.clientX - width, e.clientY - height]);
  }, [setSize]);

  const onStartResize = useCallback((e) => {
    e.preventDefault();
    sizeRef.current = [e.clientX - width, e.clientY - height];
    listenPointerMove(document, onResize);
  }, [onResize, width, height]);

  const style = {
    zIndex,
    left: left + 'px',
    top: top + 'px',
    width: width + 'px',
    height: height + 'px',
  };

  return (
    <div onMouseDown={onFocus} className={clsx(styles.container, { [styles.active]: active })} style={style}>
      <div className={clsx(styles.header, { [styles.move]: isMove })} ref={headerRef} onMouseDown={onStartMove}>
        <div className={styles.title}>{title}</div>
        <RButton className={styles.close} onClick={onClose}>&times;</RButton>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      <div className={styles.resize} onMouseDown={onStartResize}></div>
    </div>
  );
}