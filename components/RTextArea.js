import { forwardRef, useEffect } from 'react';
import clsx from '../functions/clsx';
import styles from './RTextArea.module.css';

export default forwardRef(function RTextArea({ children, onChange, onSelection, selection, className, monospace, ...rest }, ref) {
  useEffect(() => {
    ref.current.setSelectionRange(...selection);
  }, [ref, selection]);

  const selectionHandler = e => {
    onSelection?.([e.target.selectionStart, e.target.selectionEnd, e.target.selectionDirection]);
  };

  const changeHandler = e => {
    onChange(e.target.value);
  };

  return (
    <textarea
      ref={ref}
      onSelect={selectionHandler}
      onChange={changeHandler}
      className={clsx(styles.container, { [styles.monospace]: monospace }, className)}
      {...rest}
    >{children}</textarea>
  );
})