import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {mediaDevices, RTCView} from 'react-native-webrtc';
import AppButton from './AppButton';
import VitalsCardContainer from './VitalsCardContainer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VideoStream = (props) => {
  const [localStream, setLocalStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [front, setFront] = useState(true);

  useEffect(() => {
    getStream(setLocalStream);
    // return () => {
    //   setIsScanning(false);
    //   setLocalStream(null);
    // };
  }, []);

  function getStream() {
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      // console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (front ? 'front' : 'environment')
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
            facingMode: front ? 'user' : 'environment',
            deviceId: videoSourceId,
          },
        })
        .then((stream) => {
          setLocalStream(stream);
        })
        .catch((error) => {
          console.log('Error in stream', error);
          setLocalStream(null);
        });
    });
  }

  function handleFlip(e) {
    console.log('Flipped');
    localStream.getTracks().forEach((track) => track._switchCamera());
    setFront((prev) => !prev);
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
          mirror={front}
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
        <VitalsCardContainer
          onReTest={(e) => {
            props.onReset(localStream);
          }}
          pictureData={props.vitalsToDisplay}
        />
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
            onPress={(e) => {
              props.onStart(localStream);
              setIsScanning(true);
            }}
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
