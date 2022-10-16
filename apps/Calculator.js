import RButton from '../components/RButton';
import RInput from '../components/RInput';
import calculatorReducer from '../functions/calculatorReducer';
import styles from './Calculator.module.css';

export default function Note({ state, setState }) {
  const dispatch = action => {
    setState(state => calculatorReducer(state, action));
  };

  const action = type => payload => dispatch({ type, payload });

  const num = action('num');
  const sign = action('sign');
  const dot = action('dot');
  const back = action('back');
  const clear = action('clear');
  const op = action('op');
  const sqrt = action('sqrt');
  const calc = action('calc');

  const value = state.value || '0';

  return (
    <div className={styles.container}>
      <RInput className={styles.input} value={value} readOnly />
      <div className={styles.keypad}>
        <RButton onClick={() => num(7)}>7</RButton>
        <RButton onClick={() => num(8)}>8</RButton>
        <RButton onClick={() => num(9)}>9</RButton>
        <RButton onClick={() => op('/')}>/</RButton>
        <RButton onClick={back}>Back</RButton>
        <RButton onClick={() => num(4)}>4</RButton>
        <RButton onClick={() => num(5)}>5</RButton>
        <RButton onClick={() => num(6)}>6</RButton>
        <RButton onClick={() => op('*')}>*</RButton>
        <RButton onClick={clear}>C</RButton>
        <RButton onClick={() => num(1)}>1</RButton>
        <RButton onClick={() => num(2)}>2</RButton>
        <RButton onClick={() => num(3)}>3</RButton>
        <RButton onClick={() => op('-')}>-</RButton>
        <RButton onClick={sqrt}>sqrt</RButton>
        <RButton onClick={() => num(0)}>0</RButton>
        <RButton onClick={sign}>+/-</RButton>
        <RButton onClick={dot}>.</RButton>
        <RButton onClick={() => op('+')}>+</RButton>
        <RButton onClick={calc}>=</RButton>
      </div>
    </div>
  );
}