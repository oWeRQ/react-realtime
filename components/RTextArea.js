import { forwardRef } from 'react';
import clsx from '../functions/clsx';
import styles from './RTextArea.module.css';

export default forwardRef(function RTextArea({ children, value, onChange, style, monospace }, ref) {
  return (
    <textarea
      ref={ref}
      type="button"
      value={value}
      onChange={e => onChange(e.target.value)}
      className={clsx(styles.container, { [styles.monospace]: monospace })}
      style={style}
    >{children}</textarea>
  );
})