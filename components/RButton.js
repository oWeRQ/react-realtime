import { forwardRef } from 'react';
import clsx from '../functions/clsx';
import styles from './RButton.module.css';

export default forwardRef(function RButton({ children, onClick, className = '', active = false, bold = false }, ref) {
  return (
    <button ref={ref} onClick={onClick} type="button" className={clsx({ [styles.container]: true, [styles.active]: active, [styles.bold]: bold, [className]: true })}>
      {children}
    </button>
  );
})