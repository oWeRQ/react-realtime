import { forwardRef, useCallback, useEffect } from 'react';
import clsx from '../functions/clsx';
import useForwardedRef from '../hooks/useForwardedRef';
import styles from './RTextArea.module.css';

export default forwardRef(function RTextArea({ children, onChange, onSelection, selection, className, monospace, ...rest }, ref) {
  const inputRef = useForwardedRef(ref);

  const revertSelection = useCallback(() => {
    if (selection) {
      inputRef.current.setSelectionRange(...selection);
    }
  }, [inputRef, selection]);

  useEffect(revertSelection, [revertSelection]);

  const focusHandler = e => {
    e.preventDefault();
    revertSelection();
  };

  const selectHandler = onSelection && (() => {
    onSelection([inputRef.current.selectionStart, inputRef.current.selectionEnd, inputRef.current.selectionDirection]);
  });

  const changeHandler = () => {
    onChange(inputRef.current.value);
  };

  return (
    <textarea
      ref={inputRef}
      onFocus={focusHandler}
      onSelect={selectHandler}
      onChange={changeHandler}
      className={clsx(styles.container, { [styles.monospace]: monospace }, className)}
      {...rest}
    >{children}</textarea>
  );
})