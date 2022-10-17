import RButton from '../components/RButton';
import RInput from '../components/RInput';
import calculatorReducer from '../reducers/calculatorReducer';
import styles from './Calculator.module.css';

export default function Note({ state, setState }) {
  const action = (type, payload) => () => setState(calculatorReducer(state, { type, payload }));

  return (
    <div className={styles.container}>
      <RInput className={styles.input} value={state.value || '0'} readOnly />
      <div className={styles.keypad}>
        <RButton onClick={action('num', 7)}>7</RButton>
        <RButton onClick={action('num', 8)}>8</RButton>
        <RButton onClick={action('num', 9)}>9</RButton>
        <RButton onClick={action('op', '/')}>/</RButton>
        <RButton onClick={action('back')}>Back</RButton>
        <RButton onClick={action('num', 4)}>4</RButton>
        <RButton onClick={action('num', 5)}>5</RButton>
        <RButton onClick={action('num', 6)}>6</RButton>
        <RButton onClick={action('op', '*')}>*</RButton>
        <RButton onClick={action('clear')}>C</RButton>
        <RButton onClick={action('num', 1)}>1</RButton>
        <RButton onClick={action('num', 2)}>2</RButton>
        <RButton onClick={action('num', 3)}>3</RButton>
        <RButton onClick={action('op', '-')}>-</RButton>
        <RButton onClick={action('sqrt')}>sqrt</RButton>
        <RButton onClick={action('num', 0)}>0</RButton>
        <RButton onClick={action('sign')}>+/-</RButton>
        <RButton onClick={action('dot')}>.</RButton>
        <RButton onClick={action('op', '+')}>+</RButton>
        <RButton onClick={action('calc')}>=</RButton>
      </div>
    </div>
  );
}