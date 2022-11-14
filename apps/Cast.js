import { useEffect, useRef, useState } from 'react';
import RButton from '../components/RButton';
import styles from './Cast.module.css';

const iceServers = [
  {
    urls: "stun:stun.stunprotocol.org",
  },
  {
    urls: "stun:stun.l.google.com:19302",
  },
];

export default function Cast({ state, setState, resize }) {
  const isReady = Boolean(state.listeners);
  const videoRef = useRef();
  const [caster, setCaster] = useState(false);

  useEffect(() => {
    resize(960, 432);
  }, [resize]);

  const ready = async () => {
    setCaster(true);
    setState({
      listeners: [],
    });

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      
      videoRef.current.srcObject = localStream;
    } catch (e) {
      stop();
    }
  };

  const stop = async () => {
    const stream = videoRef.current.srcObject;
    stream?.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCaster(false);
    setState({});
  };

  return (
    <>
      <div className={styles.toolbar}>
        {isReady || <RButton onClick={ready}>Ready</RButton>}
        {isReady && caster && <RButton onClick={stop}>Stop</RButton>}
      </div>
      <div className={styles.content}>
        <video className={styles.video} ref={videoRef} autoPlay muted={true} width={540} height={400}></video>
        <div className={styles.state}>{JSON.stringify(state, null, 2)}</div>
      </div>
    </>
  );
}