import { useEffect, useState } from "react";
import clsx from "../functions/clsx";
import styles from './RTaskBarTime.module.css';

export default function RTaskBarTime({ children, className }) {
  const [time, setTime] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toTimeString().slice(0, 5));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={clsx(styles.container, className)}>
      {children}
      <div className={styles.time}>{time}</div>
    </div>
  );
}