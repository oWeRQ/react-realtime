import { forwardRef } from 'react';
import clsx from '../functions/clsx';
import styles from './RInput.module.css';

export default forwardRef(function RInput({ onChange, className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      onChange={e => onChange(e.target.value)}
      className={clsx(styles.container, className)}
      {...rest}
    />
  );
})