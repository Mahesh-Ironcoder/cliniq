import 'react-native-gesture-handler';
import React from 'react';
import {Text, StyleSheet, View, useWindowDimensions} from 'react-native';
import {FaceDetector, RNCamera} from 'react-native-camera';
import AppButton from './AppButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

//--------------------------Done with imports-----------------------------------------------------

// function reducer(prevState, action) {
//   switch (action.type) {
//     case 'detect':
//       let faces = action.payload;
//       try {

//       } catch (e) {
//         console.log('handle Detections error;', e);
//       }
//       return state;
//     case 'flip':
//       return state;
//     default:
//       return state;
//   }
// }

const CustomCamera = React.forwardRef((props, ref) => {
  const [detections, setDetections] = React.useState([]);
  const [type, setType] = React.useState(RNCamera.Constants.Type.front);
  // const [state, dispatch] = useReducer(reducer, initialState, init);

  const screen = useWindowDimensions();

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
    // try {
    //   if (faces.length === 0) {
    //     setDetections([]);
    //   }
    //   setDetections([...faces]);
    // } catch (e) {
    //   console.log('handle Detections error;', e);
    // }
  };

  const handleFlip = () => {
    setType(
      type === RNCamera.Constants.Type.front
        ? RNCamera.Constants.Type.back
        : RNCamera.Constants.Type.front,
    );
  };

  return (
    <View style={cameraStyles.camContainer}>
      <RNCamera
        ref={ref}
        type={type}
        style={cameraStyles.cam}
        whiteBalance={RNCamera.Constants.WhiteBalance.auto}
        onFacesDetected={handleDetections}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.none,
          minDetectionInterval: 1000,
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
        cameraViewDimensions={{width: screen.width, height: screen.height}}>
        {/* ----------------------Children components--------------------------------------*/}
        {({camera, status}) => {
          if (status !== 'READY') {
            return (
              <View>
                <Text>NO permissions for camera</Text>
              </View>
            );
          }

          if (props.hideControls) {
            return null;
          }

          return (
            <>
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
              <View style={cameraStyles.hmBtnGrp}>
                <AppButton
                  style={{
                    flexBasis: 200,
                    backgroundColor: '#F2AB1D',
                  }}
                  textStyle={{color: 'white', fontSize: 18}}
                  title="Start Scan"
                  rounded
                  onPress={props.onScan || null}
                />
                <Icon.Button
                  name="camera-rear"
                  size={25}
                  backgroundColor="#37BCDF"
                  color="white"
                  onPress={handleFlip}>
                  Flip
                </Icon.Button>
                <Text style={cameraStyles.bottomText}>
                  Click on start to begin the process
                </Text>
              </View>
            </>
          );
        }}
        {/* --------------------------------------children components end----------------- */}
      </RNCamera>
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
    // flexBasis: '100%',
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
  },
});

export default CustomCamera;
