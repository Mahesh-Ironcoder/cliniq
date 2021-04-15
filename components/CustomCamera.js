import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FaceDetector, RNCamera} from 'react-native-camera';
import 'react-native-gesture-handler';

//--------------------------Done with imports-----------------------------------------------------

const CustomCamera = React.forwardRef((props, ref) => {
  const [detections, setDetections] = React.useState([]);

  const handleDetections = ({faces}) => {
    try {
      setDetections((prevState) => {
        let currentFaces = [];

        if (
          prevState.length === currentFaces.length &&
          prevState.every((v, i) => v === currentFaces[i])
        ) {
          currentFaces = faces;
        }
        return [...currentFaces];
      });
    } catch (e) {
      console.log('handle Detections error;', e);
    }
  };

  // React.useEffect(() => {
  //   setDetections((prevState) => {
  //     return prevState.length === detections.length &&
  //       prevState.every((v, i) => v === detections[i])
  //       ? []
  //       : [...detections];
  //   });
  // });

  return (
    <View style={cameraStyles.camContainer}>
      <RNCamera
        ref={ref}
        type={props.variant}
        style={cameraStyles.cam}
        whiteBalance={RNCamera.Constants.WhiteBalance.auto}
        onFacesDetected={(d) => {
          // console.log('S F D');
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
      />

      {detections.map((face, id) => {
        return (
          <View
            key={id}
            style={{
              borderWidth: 2,
              borderColor: 'green',
              position: 'absolute',
              top: face.bounds.origin.y - 25,
              left: face.bounds.origin.x - 60,
              width: face.bounds.size.width + 50,
              height: face.bounds.size.height + 25,
            }}
          />
        );
      })}
    </View>
  );
});

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
