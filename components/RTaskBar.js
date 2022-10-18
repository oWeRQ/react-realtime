import clsx from '../functions/clsx';
import styles from './RTaskBar.module.css';

export default function RTaskBar({ children, className }) {
  return (
    <div className={clsx(styles.container, className)}>
      {children}
    </div>
  );
}