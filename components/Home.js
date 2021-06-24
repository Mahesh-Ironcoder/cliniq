import VideoStream from './VideoStream';

import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {useIsFocused} from '@react-navigation/core';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MoreOptions from './MoreOptions';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';

//--------------------------Done with imports----------------------------------------
const Tab = createBottomTabNavigator();

const URL = 'http://127.0.0.1:6061/ws';
const configuration = {
  iceServers: [
    {url: 'stun:stun.l.google.com:19302'},
    /* {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com',
    }, */
  ],
  sdpSemantics: 'unified-plan',
};

const Home = (props) => {
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  const [vitalsData, setVitalsData] = useState(null);
  /**
   * RTCPeer effect
   */
  useEffect(() => {
    if (!peer) {
      console.log('No peer connection');
      return;
    }
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        let data = {Msgtype: 'ice', IceCandidate: event.candidate};
        console.log('Sending candidates...');
        sendJsonMsg(data);
      }
    };
    peer.onnegotiationneeded = async (event) => {
      console.log('Negotiating with peer server...', event);
      let offer = await peer
        .createOffer()
        .catch((e) => console.log('Error in creating an offer'));

      await peer
        .setLocalDescription(offer)
        .catch('Error in setting the local description');

      let data = {Msgtype: 'offer', sdp: offer.sdp};
      console.log('Sending offer');
      sendJsonMsg(data);
    };
  }, [peer]);

  /**
   * Web socket effect
   */
  useEffect(() => {
    if (!socket) {
      console.log('No socket to connect with');
      return;
    }

    socket.onopen = (event) => {
      console.log('Connection to the server is opened...!', event);
      setPeer(new RTCPeerConnection(configuration));
    };

    socket.onmessage = (event) => {
      console.log('Recived a message from the other side');
      let data = JSON.parse(event.data);
      switch (data.type) {
        case 'answer':
          console.log('Recieved answer from the peer: ', data);
          handleAnswer(data, peer);
          break;
        case 'ice':
          console.log(
            'Recived ice candidate from remote peer',
            data.IceCandidate,
          );
          // handleIceCandidate(data.IceCandidate);
          break;
        case 'result':
          console.log('Recieved result from the peer: ', data.result);
          handleResult(JSON.parse(data.result));
          break;

        default:
          break;
      }
    };

    socket.onclose = (event) => {
      console.log('Closing the connection...');
      handleStop();
    };

    socket.onerror = (event) => {
      console.log('Error in connecting to websocket: ', event);
    };
  }, [socket, peer]);

  useEffect(() => {
    setSocket(new WebSocket(URL));
    return () => {
      console.log('Distructing', socket);
      socket.close();
      handleStop();
    };
  }, []);

  /**
   * utilities and handlers
   */

  //stream handlers
  function handleStart(stream) {
    peer.addStream(stream);
  }

  function handleStop() {
    if (!peer) {
      return;
    }
    if (peer.getTransceivers) {
      peer.getTransceivers().forEach(function (transceiver) {
        if (transceiver.stop) {
          transceiver.stop();
        }
      });
    }

    //remove stream
    let localStreams = peer.getLocalStreams();
    localStreams.forEach((stream) => {
      peer.removeStream(stream);
    });

    // close peer connection
    peer.close();
  }

  function handleReset(stream) {
    peer.removeStream(stream);
  }

  //socket handlers
  function sendJsonMsg(data) {
    socket.send(JSON.stringify(data));
  }

  //message event handlers
  async function handleAnswer(answer, peer) {
    console.log('answer received: ', typeof answer);
    if (peer === null) {
      console.log('No peer at answer');
      return;
    }
    await peer
      .setRemoteDescription(new RTCSessionDescription(answer))
      .catch((e) => {
        console.log('Error in setting the answer', e);
      });
  }

  function handleResult(result) {
    if (!result[8].value) {
      return;
    }
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

  async function handleIceCandidate(candidate) {
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }

  const isFocused = useIsFocused();

  function HomeScreen() {
    return (
      <View style={homescreenStyles.homeContainer}>
        <VideoStream
          onStart={handleStart}
          onReset={handleReset}
          vitalsToDisplay={vitalsData}
        />
      </View>
    );
  }

  if (isFocused) {
    return (
      <Tab.Navigator
        tabBarOptions={{
          style: {height: '6%'},
          tabStyle: {alignItems: 'center'},
          labelStyle: {fontSize: 14},
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreOptions}
          options={{
            tabBarLabel: 'More',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="more-horiz" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  } else {
    return null;
  }
};

const homescreenStyles = StyleSheet.create({
  homeContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  drawerNavigationStyles: {
    width: 300,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  drawerNavigationItems: {
    width: 250,
    backgroundColor: '#303f9f',
  },
  drawer: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'transparent',
  },
  drawerText: {
    padding: 0,
    fontSize: 24,
    textAlign: 'center',
  },
  tabNavStyles: {
    height: '200',
    position: 'absolute',
    backgroundColor: 'red',
  },

  // remove after testing
  hmBtnGrp: {
    width: '100%',
    position: 'absolute',
    height: '15%',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    alignContent: 'space-between',
  },
  bottomText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
  },
});

export default Home;
