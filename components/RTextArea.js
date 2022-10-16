import { forwardRef } from 'react';
import clsx from '../functions/clsx';
import styles from './RTextArea.module.css';

export default forwardRef(function RTextArea({ children, value, onChange }, ref) {
  return (
    <textarea ref={ref} type="button" className={clsx({ [styles.container]: true })} value={value} onChange={e => onChange(e.target.value)}>
      {children}
    </textarea>
  );
})