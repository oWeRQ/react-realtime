import { useState } from 'react';
import RButton from '../components/RButton';
import RInput from '../components/RInput';
import styles from './Calculator.module.css';

function calcReducer(state, { type, payload }) {
  switch (type) {
    case '/':
      return state / payload;
    case '*':
      return state * payload;
    case '-':
      return state - payload;
    case '+':
      return state + payload;
  }

  return payload;
}

export default function Note({ data, onData }) {
  const [firstValue, setFirstValue] = useState();
  const [firstOp, setFirstOp] = useState();
  const [value, setValue] = useState('0');

  const num = num => {
    setValue(value => (+value === 0 ? '' : value) + String(num));
  };

  const sign = () => {
    setValue(value => String(-+value));
  };

  const dot = () => {
    setValue(value => value.replace(/\./g, '') + '.');
  };

  const back = () => {
    setValue(value => value.slice(0, -1) || '0');
  }

  const clear = () => {
    setValue('0');
  }

  const op = op => {
    setFirstValue(+value)
    setFirstOp(op)
    setValue('0');
  };

  const sqrt = () => {
    setValue(value => String(Math.sqrt(+value)));
    setFirstOp();
  };

  const calc = () => {
    setValue(value => String(calcReducer(firstValue, { type: firstOp, payload: +value })));
    setFirstOp();
  };

  return (
    <div className={styles.container}>
      <RInput className={styles.input} value={value} onChange={setValue} readOnly />
      <div className={styles.keypad}>
        <RButton onClick={() => num(7)}>7</RButton>
        <RButton onClick={() => num(8)}>8</RButton>
        <RButton onClick={() => num(9)}>9</RButton>
        <RButton onClick={() => op('/')}>/</RButton>
        <RButton onClick={() => back()}>Back</RButton>
        <RButton onClick={() => num(4)}>4</RButton>
        <RButton onClick={() => num(5)}>5</RButton>
        <RButton onClick={() => num(6)}>6</RButton>
        <RButton onClick={() => op('*')}>*</RButton>
        <RButton onClick={() => clear()}>C</RButton>
        <RButton onClick={() => num(1)}>1</RButton>
        <RButton onClick={() => num(2)}>2</RButton>
        <RButton onClick={() => num(3)}>3</RButton>
        <RButton onClick={() => op('-')}>-</RButton>
        <RButton onClick={() => sqrt()}>sqrt</RButton>
        <RButton onClick={() => num(0)}>0</RButton>
        <RButton onClick={() => sign()}>+/-</RButton>
        <RButton onClick={() => dot()}>.</RButton>
        <RButton onClick={() => op('+')}>+</RButton>
        <RButton onClick={() => calc()}>=</RButton>
      </div>
    </div>
  );
}