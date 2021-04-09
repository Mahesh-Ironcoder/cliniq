import 'react-native-gesture-handler';

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RNCamera, FaceDetector} from 'react-native-camera';

const CustomCamera = React.forwardRef((props, ref) => {
  const [detections, setDetections] = React.useState([]);

  // const handleDetections = React.useCallback(
  //   ({faces}) => {
  //     console.log('detections: ', faces);
  //     try {
  //       setDetections([...faces]);
  //     } catch (e) {
  //       console.log('handle Detection error;', e);
  //     }
  //   },
  //   [detections],
  // );
  const handleDetections = ({faces}) => {
    // console.log('detections: ', faces);
    try {
      setDetections([...faces]);
    } catch (e) {
      console.log('handle Detection error;', e);
    }
  };

  // React.useEffect(() => {
  //   (async () => {
  //     try {
  //       if (ref && ref !== null) {
  //         let ratio = await ref.current.getSupportedRatiosAsync();
  //         console.log('Ratio: ', ratio);
  //         setCamOptions({ratio: ratio.reverse()[0]});
  //       } else {
  //         console.info('NO ref');
  //       }
  //     } catch (e) {
  //       console.error('@CustomeCamera: Error - ', e);
  //     }
  //   })();
  // }, []);

  // React.useEffect(() => {
  //   return () => {
  //     setDetections([]);
  //   };
  // }, [detections]);

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
              borderColor: 'red',
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
