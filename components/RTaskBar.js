import styles from './RTaskBar.module.css';

export default function RTaskBar({ children }) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}