import 'react-native-gesture-handler';

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RNCamera, FaceDetector} from 'react-native-camera';

const CustomCamera = React.forwardRef((props, ref) => {
  // const [hasPermissions, setHasPermissions] = React.useState(false);
  const [boundsR, setBoundsR] = React.useState('');

  const handleDetections = React.useCallback(
    ({faces}) => {
      // console.log('BoundsR: ', faces);
      try {
        setBoundsR({...faces[0].bounds});
      } catch (e) {
        console.log('handle Detection error;', e);
      }
    },
    [boundsR],
  );

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

  React.useEffect(() => {
    // console.log('Cam rendered');
    // (async () => {
    //   try {
    //     if (ref && ref !== null) {
    //       let ratio = await ref.current.getSupportedRatiosAsync();
    //       console.log('Ratio: ', ratio);
    //       // setCamOptions({ratio: ratio.reverse()[0]});
    //     } else {
    //       console.info('NO ref');
    //     }
    //   } catch (e) {
    //     console.error('@CustomeCamera: Error - ', e);
    //   }
    // })();
    return () => {
      setBoundsR('');
    };
  });

  return (
    <View style={cameraStyles.camContainer}>
      <RNCamera
        ref={ref}
        type={props.variant}
        // ratio={
        //   camOptions !== undefined && camOptions !== null
        //     ? camOptions.ratio
        //     : '4:3'
        // }
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
      <View
        style={{
          borderWidth: 2,
          borderColor: 'red',
          position: 'absolute',
          top: boundsR ? boundsR.origin.y - 50 : 0,
          left: boundsR ? boundsR.origin.x - 50 : 0,
          width: boundsR ? boundsR.size.width : 0,
          height: boundsR ? boundsR.size.height : 0,
        }}></View>
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
