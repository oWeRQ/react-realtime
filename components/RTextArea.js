import { forwardRef, useCallback, useEffect, useState } from 'react';
import clsx from '../functions/clsx';
import useForwardedRef from '../hooks/useForwardedRef';
import styles from './RTextArea.module.css';

export default forwardRef(function RTextArea({ children, onChange, onSelection, selection, className, monospace, ...rest }, ref) {
  const inputRef = useForwardedRef(ref);
  const [focus, setFocus] = useState(false);

  const revertSelection = useCallback(() => {
    if (selection) {
      inputRef.current.setSelectionRange(...selection);
    }
  }, [inputRef, selection]);

  useEffect(revertSelection, [revertSelection]);

  const handlerPointerDown = e => {
    if (!focus) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  const handlerFocus = () => {
    setFocus(true);
  };

  const handlerBlur = () => {
    setFocus(false);
  };

  const handlerSelect = onSelection && (() => {
    onSelection([inputRef.current.selectionStart, inputRef.current.selectionEnd, inputRef.current.selectionDirection]);
  });

  const handlerChange = () => {
    onChange(inputRef.current.value);
  };

  return (
    <textarea
      ref={inputRef}
      onPointerDown={handlerPointerDown}
      onFocus={handlerFocus}
      onBlur={handlerBlur}
      onSelect={handlerSelect}
      onChange={handlerChange}
      className={clsx(styles.container, { [styles.monospace]: monospace }, className)}
      {...rest}
    >{children}</textarea>
  );
})