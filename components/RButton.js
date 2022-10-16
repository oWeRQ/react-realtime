import { forwardRef } from 'react';
import clsx from '../functions/clsx';
import styles from './RButton.module.css';

export default forwardRef(function RButton({ children, type = 'button', className = '', active = false, bold = false, ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={clsx(styles.container, { [styles.active]: active, [styles.bold]: bold }, className)} {...rest}>
      {children}
    </button>
  );
})