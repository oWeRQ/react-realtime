import { useEffect, useRef, useState } from 'react';
import RButton from '../components/RButton';

const iceServers = [
  {
    urls: "stun:stun.stunprotocol.org",
  }
];

export default function Cast({ state, setState }) {
  console.log('Call state', state);

  const videoRef = useRef();
  const [rpc, setRpc] = useState();
  const [caster, setCaster] = useState(false);
  const [listener, setListener] = useState(false);
  const muted = true;

  const ready = async () => {
    console.warn('ready', caster, listener);
    const rpc = new RTCPeerConnection({ iceServers });
    setRpc(rpc);

    rpc.onnegotiationneeded = async () => {
      const offer = await rpc.createOffer();
      await rpc.setLocalDescription(offer);
      setCaster(true);
      setState(state => ({ ...state, offer: rpc.localDescription }));
    };

    rpc.onicecandidate = async e => {
      console.warn('onicecandidate', e.candidate);
    };

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    videoRef.current.srcObject = localStream;
    localStream.getTracks().forEach(track => rpc.addTrack(track, localStream));
  };

  const answer = async () => {
    console.warn('answer', caster, listener);
    const rpc = new RTCPeerConnection({ iceServers });

    rpc.ontrack = e => {
      console.log('ontrack', e);
      videoRef.current.srcObject = e.streams[0];
    };

    rpc.onsignalingstatechange = e => {
      console.warn('onsignalingstatechange', e.signalingState);
    };

    rpc.onicecandidate = async e => {
      console.warn('onicecandidate', e.candidate);
    };

    const desc = new RTCSessionDescription(state.offer);
    await rpc.setRemoteDescription(desc);

    const answer = await rpc.createAnswer();
    await rpc.setLocalDescription(answer);
    setState(state => ({ ...state, answer: rpc.localDescription }));
    setListener(true);
    setRpc(rpc);
  }

  const stop = () => {
    const stream = videoRef.current.srcObject;
    stream?.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCaster(false);
    setState({});
  }

  useEffect(() => {
    if (!caster && !listener && state.offer) {
      answer();
    }
  }, [caster, listener, state]);

  return (
    <>
      {!state.offer && <RButton onClick={ready}>Ready</RButton>}
      {caster && <RButton onClick={stop}>Stop</RButton>}
      <video ref={videoRef} autoPlay muted={caster} width={294} height={241}></video>
    </>
  );
}