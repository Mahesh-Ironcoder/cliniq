import 'react-native-gesture-handler';

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RNCamera, FaceDetector} from 'react-native-camera';

const CustomCamera = () => {
  const [hasPermissions, setHasPermissions] = React.useState(false);
  const [boundsR, setBoundsR] = React.useState('');

  const handleDetections = ({faces}) => {
    console.log('BoundsR: ', faces);
    try {
      setBoundsR({...faces[0].bounds});
    } catch (e) {
      console.log('handle Detection error;', e);
    }
  };

  React.useEffect(() => {
    (async () => {
      const status = await Camera.getPermissionsAsync();
      setHasPermissions(status.status === 'granted');

      // console.log('status: ', status);
      if (!status.granted) {
        const isGranted = await Camera.requestPermissionsAsync();
        setHasPermissions(isGranted.status === 'granted');
      }
    })();
  }, []);
  console.log('camera boundsR: ', boundsR);
  if (!hasPermissions) {
    return (
      <View>
        <Text>No camera permissions</Text>
      </View>
    );
  }
  return (
    <View style={cameraStyles.camContainer}>
      <RNCamera
        type="front"
        style={cameraStyles.cam}
        onFacesDetected={(d) => {
          console.log('S F D');
          handleDetections(d);
        }}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
        onFacesDetectedError={(e) => {
          console.log('Error: ', e);
        }}
      />
      <View
        style={{
          borderWidth: 1,
          borderColor: 'red',
          position: 'absolute',
          top: 3,
          width: boundsR ? boundsR.size.width : 100,
        }}></View>
    </View>
  );
};

const cameraStyles = StyleSheet.create({
  camContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cam: {
    width: '100%',
    height: '100%',
  },
});

export default CustomCamera;
