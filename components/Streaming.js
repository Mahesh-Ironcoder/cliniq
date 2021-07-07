import {useState, useEffect} from 'react';
import { RTCPeerConnection } from 'react-native-webrtc';

function useStreaming(peerConfig) {
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  useEffect(() => {
    if (!socket) {
      return
    }
    socket.onopen = (event) => {
      console.log('Connection to websocket is open');
      // setSocketActive(true);
    };
    socket.onmessage = (event) => {
      console.log('Message recieved from Websocket: ');
      let data = JSON.parse(event.data);
      switch (data.type) {
        case 'answer':
          console.log('Recieved answer from the peer: ', data);
          handleAnswer(data);
          break;
        case 'result':
          console.log('Recieved result from the peer: ', data.result);
          handleResult(JSON.parse(data.result));
          // setVitalsData(data.result);
          break;
        case 'iceCandidate':
          console.log(
            'Recived ice candidate from remote peer',
            data.IceCandidate,
          );
          handleIceCandidate(data.IceCandidate);
        default:
          console.log('no');
          break;
      }
    };
    socket.onclose = (event) => {
      console.log('Closing connection to websocket: ');
      // peer.close();
      // setSocketActive(false);
    };
    socket.onerror = (event) => {
      console.log('Error in connecting to websocket: ', event);
      // setSocketActive(false);
    };
  }, [socket])

  function createPeerConnection() {
    const pc = RTCPeerConnection(peerConfig);

  }
  async function createOffer() {
    if (!socketActive) {
      alert('Socket is not active');
      return;
    }
    // console.log('Peer: ', peer);
    let offer = await peer
      .createOffer()
      .catch((e) => console.log('Error in createOFFer: ', e));
    await peer
      .setLocalDescription(offer)
      .catch((e) => console.log('Error in setting LD: ', e));
    data = {Msgtype: 'offer', sdp: offer.sdp};
    // console.log('Sending offer: ', data);
    sendJsonMsg(data);
  }
  
  function connect(url) {
    const ws = new WebSocket(url);
    setSocket(ws);
  }
  return;
}

export default useStreaming;
