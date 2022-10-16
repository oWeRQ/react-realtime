import { forwardRef } from 'react';
import clsx from '../functions/clsx';
import styles from './RTextArea.module.css';

export default forwardRef(function RTextArea({ children, onChange, className, monospace, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      onChange={e => onChange(e.target.value)}
      className={clsx(styles.container, { [styles.monospace]: monospace }, className)}
      {...rest}
    >{children}</textarea>
  );
})