import styles from './RMenuItem.module.css';

export default function RMenuItem({ onClick, children }) {
  return (
    <div className={styles.container} onClick={onClick}>
      {children}
    </div>
  );
}