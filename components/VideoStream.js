// import 'react-native-gesture-handler';
import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  mediaDevices,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from 'react-native-webrtc';
import AppButton from './AppButton';
import VitalsCardContainer from './VitalsCardContainer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const URL = 'http://127.0.0.1:6061/ws';
const configuration = {
  iceServers: [
    {url: 'stun:stun.l.google.com:19302'},
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com',
    },
  ],
  sdpSemantics: 'unified-plan',
};
// RTCC
// const peer = new RTCPeerConnection(configuration);
// const socket = new WebSocket(URL);

const VideoStream = (props) => {
  const [localStream, setLocalStream] = useState(null);
  // const [remoteStream, setRemoteStream] = useState(null);
  const [socketActive, setSocketActive] = useState(false);
  const [socket, setSocket] = useState(null);
  // const [socket, setSocket] = useState(new WebSocket(URL));
  const [peer, setPeer] = useState(new RTCPeerConnection(configuration));
  const [isScanning, setIsScanning] = useState(false);

  const [vitalsData, setVitalsData] = useState(null);
  // const vitalsRef = useRef(null);

  useEffect(() => {
    if (!socketActive) {
      alert('Sockets is not active');
      return;
    }
    peer.onicecandidate = (evt) => {
      if (evt.candidate) {
        console.log('Event cand: ', evt.candidate);
        var data = {
          Msgtype: 'ice',
          IceCandidate: evt.candidate,
        };
        console.log('Sending candidates...');
        sendJsonMsg(data);
      }
    };

    // peer.onaddstream = (event) => {
    //   console.log('Got peeer connection', event.stream.getVideoTracks());
    //   setRemoteStream(event.stream);
    // };
    // peer.onnegotiationneeded = () => {
    //   console.log('Neogtiation needed: ');
    //   createOffer();
    // };
  }, [socketActive]);

  useEffect(() => {
    if (!socket) {
      alert('NO socket');
      return;
    }
    // setSocket(new WebSocket(URL));
    socket.onopen = (event) => {
      console.log('Connection to websocket is open');
      setSocketActive(true);
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
      setSocketActive(false);
    };
    socket.onerror = (event) => {
      console.log('Error in connecting to websocket: ', event);
      setSocketActive(false);
    };

    return () => {
      console.log('Distructing..');
      // peer.close();
      stop();
      socket.close();
    };
  }, [socket]);

  useEffect(() => {
    if (!localStream) {
      return;
    }
    setSocket(new WebSocket(URL));
  }, [localStream]);

  useEffect(() => {
    getStream(setLocalStream);
  }, []);

  function getStream(setLocalStream) {
    let isFront = true;

    mediaDevices.enumerateDevices().then((sourceInfos) => {
      // console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: isFront ? 'user' : 'environment',
            deviceId: videoSourceId,
          },
        })
        .then((stream) => {
          setLocalStream(stream);
          peer.addStream(stream);
        })
        .catch((error) => {
          console.log('Error in stream', error);
          setStream(null);
        });
    });
  }

  async function handleAnswer(answer) {
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async function handleIceCandidate(candidate) {
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }

  function handleResult(result) {
    let data = {};
    data['Blood Pressure'] = [
      {title: 'Systolic', value: result[3].value},
      {title: 'Diastolic', value: result[4].value},
    ];
    data['Saturation'] = result[0].value + '%';
    data['Heart Rate'] = result[1].value + result[1].prefix;
    data['Respiration'] = result[2].value + result[2].prefix;
    data['Temperature'] = result[5].value + result[5].prefix;
    // data['Saturation'] = respText[0].value + respText[0].prefix;
    // console.log('Vitals data updating are: ', data);
    setVitalsData(data);
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

  function start() {
    createOffer();
    setIsScanning(true);
  }

  function stop() {
    if (peer.getTransceivers) {
      peer.getTransceivers().forEach(function (transceiver) {
        if (transceiver.stop) {
          transceiver.stop();
        }
      });
    }
    // peer.
    peer.removeStream(localStream);

    // close peer connection
    setTimeout(function () {
      peer.close();
    }, 500);
  }

  /*   function createOffer() {
    console.log('Peer: ', peer);
    peer
      .createOffer()
      .then((desc) => {
        console.log('createOffer', desc);
        peer.setLocalDescription(
          desc,
          () => {
            console.log('setLocalDescription', peer.localDescription);
            // SocketUtils.emitExchangeServerSdp(socketId, peer.localDescription);
            data = {Msgtype: 'offer', sdp: offer.sdp};
            sendJsonMsg(data);
          },
          (error) => console.log(' LD error : ' + error),
        );
      })
      .catch((error) => console.log('Offer error : ' + error));
  } */

  function sendJsonMsg(data) {
    socket.send(JSON.stringify(data));
  }

  function handleFlip(e) {
    console.log('Flipped');
  }

  function handleReset(e) {
    peer.removeStream(localStream);
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}>
      {localStream ? (
        <RTCView
          streamURL={localStream.toURL()}
          objectFit={'cover'}
          mirror={true}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            // zIndex: -1,
          }}
        />
      ) : (
        <View>
          <Text>Loding Camera...</Text>
        </View>
      )}
      {isScanning ? (
        <VitalsCardContainer onReTest={handleReset} pictureData={vitalsData} />
      ) : (
        <View style={styles.btnGrp}>
          <AppButton
            style={{
              flexBasis: 200,
              backgroundColor: '#F2AB1D',
            }}
            textStyle={{color: 'white', fontSize: 18}}
            title="Start Scan"
            rounded
            onPress={start}
          />
          <Icon.Button
            name="camera-rear"
            size={25}
            backgroundColor="#37BCDF"
            color="white"
            onPress={handleFlip}>
            Flip
          </Icon.Button>
          <Text style={styles.bottomText}>
            Click on start to begin the process
          </Text>
        </View>
      )}
      {/* {remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          objectFit={'contain'}
          mirror={true}
          zOrder={2}
          style={{
            width: 320,
            height: 480,
            position: 'absolute',
            top: 10,
            borderWidth: 2,
            // right: 0,
            // zIndex: -1,
          }}
        />
      ) : null} */}
    </View>
  );
};

export default VideoStream;

const styles = StyleSheet.create({
  btnGrp: {
    width: '100%',
    position: 'absolute',
    height: '15%',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    zIndex: 100,
  },
  bottomText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
  },
});
