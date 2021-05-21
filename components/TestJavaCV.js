import React from 'react';
import {useRef} from 'react';
import {Alert, Button, Dimensions, StyleSheet, Text, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import JavaCV from '../src/nativeModules/JavaCV';

const TestJavaCV = () => {
  const camera = useRef(null);
  const screen = Dimensions.get('screen');
  const [frames, setFrames] = React.useState('');

  const onError = (e) => {
    console.log('RNJS error: ', e);
  };

  const onCapture = (e) => {
    console.log('RNJS Success: ', e);
  };

  const handleCapture = async () => {
    const vidData = await camera.current.recordAsync({
      maxDuration: 10,
      quality: RNCamera.Constants.VideoQuality['720p'],
    });
    console.log('Viddata: ', vidData);
    JavaCV.getFramesFromVideo(vidData.uri, onError, onCapture);
  };

  const handleRetrive = () => {
    JavaCV.getFramesList(onError, (frames) => {
      setFrames(frames);
    });
    Alert.alert('Frames in the Video', frames.toString(), [
      {
        text: 'Ok',
        onPress: () => {
          console.log('Frames from the viedo: ', frames);
        },
      },
    ]);
  };

  return (
    <RNCamera
      style={styles.cam}
      ref={camera}
      type={RNCamera.Constants.Type.front}
      androidCameraPermissionOptions={{
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}
      androidRecordAudioPermissionOptions={{
        title: 'Permission to use audio recording',
        message: 'We need your permission to use your audio',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}
      cameraViewDimensions={{width: screen.width, height: screen.height}}>
      <Button title="Capture" onPress={handleCapture} />
      <Button title="Grab frames" onPress={handleRetrive} />
    </RNCamera>
  );
};

export default TestJavaCV;

const styles = StyleSheet.create({
  cam: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
});
