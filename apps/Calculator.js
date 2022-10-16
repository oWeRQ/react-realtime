import RButton from '../components/RButton';
import RInput from '../components/RInput';
import styles from './Calculator.module.css';

export default function Note({ data, onData }) {
  return (
    <div className={styles.container}>
      <RInput className={styles.input} />
      <div className={styles.keypad}>
        <RButton>7</RButton>
        <RButton>6</RButton>
        <RButton>8</RButton>
        <RButton>/</RButton>
        <RButton>sqrt</RButton>
        <RButton>4</RButton>
        <RButton>5</RButton>
        <RButton>6</RButton>
        <RButton>*</RButton>
        <RButton>%</RButton>
        <RButton>1</RButton>
        <RButton>2</RButton>
        <RButton>3</RButton>
        <RButton>-</RButton>
        <RButton>1/x</RButton>
        <RButton>0</RButton>
        <RButton>+/-</RButton>
        <RButton>.</RButton>
        <RButton>+</RButton>
        <RButton>=</RButton>
      </div>
    </div>
  );
}