import { useEffect, useRef, useState } from 'react';
import RButton from '../components/RButton';

const iceServers = [
  {
    urls: "stun:stun.stunprotocol.org",
  },
  {
    urls: "stun:stun.l.google.com:19302",
  },
];

export default function Cast({ state, setState }) {
  const videoRef = useRef();
  const [rpc, setRpc] = useState();
  const [caster, setCaster] = useState(false);
  const [listener, setListener] = useState(false);

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

    rpc.onsignalingstatechange = e => {
      console.warn('onsignalingstatechange', rpc.signalingState);
    }

    rpc.connectionstatechange = e => {
      console.warn('connectionstatechange', e);
    };

    rpc.onicecandidate = async e => {
      if (e.candidate) {
        setState(state => ({ ...state, offerCandidates: [...(state.offerCandidates ?? []), e.candidate] }));
      }
    };

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });

    videoRef.current.srcObject = localStream;
    localStream.getTracks().forEach(track => rpc.addTrack(track, localStream));
  };

  const answer = async () => {
    console.warn('answer', caster, listener, state.iceCandidates);
    const rpc = new RTCPeerConnection({ iceServers });

    rpc.ontrack = e => {
      console.log('ontrack', e);
      videoRef.current.srcObject = e.streams[0];
    };

    rpc.onsignalingstatechange = e => {
      console.warn('onsignalingstatechange', rpc.signalingState);
    }

    rpc.connectionstatechange = e => {
      console.warn('connectionstatechange', e);
    };

    rpc.onicecandidate = async e => {
      if (e.candidate) {
        setState(state => ({ ...state, answerCandidates: [...(state.answerCandidates ?? []), e.candidate] }));
      }
    };

    const desc = new RTCSessionDescription(state.offer);
    await rpc.setRemoteDescription(desc);

    const answer = await rpc.createAnswer();
    await rpc.setLocalDescription(answer);
    setState(state => ({ ...state, answer: rpc.localDescription }));
    setListener(true);
    setRpc(rpc);
  }

  const receiveAnswer = async () => {
    console.log('receiveAnswer', rpc.signalingState);
    if (rpc.signalingState !== 'stable') {
      const desc = new RTCSessionDescription(state.answer);
      await rpc.setRemoteDescription(desc);
    }
  };

  const receiveCandidates = async () => {
    if (caster && state.answerCandidates && rpc.iceConnectionState !== 'connected') {
      console.warn('answerCandidates', rpc.iceConnectionState, state.answerCandidates);
      state.answerCandidates.forEach(candidate => rpc.addIceCandidate(new RTCIceCandidate(candidate)));
    }

    if (listener && state.offerCandidates && rpc.iceConnectionState !== 'connected') {
      console.warn('offerCandidates', rpc.iceConnectionState, state.offerCandidates);
      state.offerCandidates.forEach(candidate => rpc.addIceCandidate(new RTCIceCandidate(candidate)));
    }
    console.log('rpc', rpc);
  };

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

    if (caster && state.answer) {
      receiveAnswer();
    }

    receiveCandidates();
  }, [caster, listener, state]);

  return (
    <>
      {!state.offer && <RButton onClick={ready}>Ready</RButton>}
      {caster && <RButton onClick={stop}>Stop</RButton>}
      <video ref={videoRef} autoPlay muted={caster} width={294} height={241}></video>
    </>
  );
}