import clsx from '../functions/clsx';
import styles from './RCheckbox.module.css';

export default function RCheckbox({ children, className, ...rest }) {
  return (
    <label className={clsx(styles.container, className)}>
      <input className={clsx(styles.input)} type="checkbox" {...rest} />
      <span className={clsx(styles.indicator)}></span>
      <span className={styles.text}>{children}</span>
    </label>
  );
}