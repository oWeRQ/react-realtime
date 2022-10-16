import { useEffect, useRef } from 'react';
import styles from './Paint.module.css';

export default function Paint({ state, setState }) {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const context = ref.current.getContext('2d');

    if (state?.canvas) {
      const img = new Image();
      img.onload = () => {
        // context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = state?.canvas;
    } else {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    let started = false;

    function mousedown(ev) {
      context.beginPath();
      context.moveTo(ev.layerX, ev.layerY);
      started = true;
    }

    function mousemove(ev) {
      if (started) {
        context.lineTo(ev.layerX, ev.layerY);
        context.stroke();
      }
    };

    function mouseup(ev) {
      if (started) {
        mousemove(ev);
        started = false;
        setState({
          canvas: canvas.toDataURL(),
        });
      }
    };

    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mouseup', mouseup);

    return () => {
      console.log('destroy Paint');
      canvas.removeEventListener('mousedown', mousedown);
      canvas.removeEventListener('mousemove', mousemove);
      canvas.removeEventListener('mouseup', mouseup);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <canvas className={styles.canvas} ref={ref} width="294" height="272"></canvas>
  );
}