import clsx from '../functions/clsx';
import styles from './RDesktop.module.css';

export default function RDesktop({ children, className }) {
  return (
    <div className={clsx(styles.container, className)}>
      {children}
    </div>
  );
}