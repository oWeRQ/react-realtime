import styles from './RDesktop.module.css';

export default function RDesktop({ children }) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}