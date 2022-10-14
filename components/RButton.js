import clsx from '../functions/clsx';
import styles from './RButton.module.css';

export default function RButton({ children, active = false, bold = false }) {
  return (
    <button type="button" className={clsx({ [styles.container]: true, [styles.active]: active, [styles.bold]: bold })}>
      {children}
    </button>
  );
}