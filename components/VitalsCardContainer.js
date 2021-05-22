import React from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Animated,
  Pressable,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FullVitals from './FullVitals';

import ProgressBar from './ProgressBar';
import Vitals from './Vitals';

import * as RNFS from 'react-native-fs';

import JavaCV from '../src/nativeModules/JavaCV';

const data = {
  'Blood Pressure': [
    {title: 'Diastolic', value: 120},
    {title: 'Systolic', value: 80},
  ],
  Temperature1: '80F',
  Temperature2: '80F',
  SpO2: '90%',
  Temperature3: '80F',
};
const idata = {
  'Blood Pressure': null,
  Temperature1: null,
  Temperature2: null,
  SpO2: null,
  Temperature3: null,
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'set':
      return {loading: false, vitals: {...action.payload}};
    case 'reset':
      return {loading: true, vitals: idata};
    default:
      return prevState;
  }
};

const VitalsCardContainer = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [vitals, setVitals] = React.useState(idata);
  const [converted, setConverted] = React.useState(false);
  const [imgUri, setImgUri] = React.useState('');

  /* React.useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false);
    //   setVitals(data);
    // }, 3000);
    let formData = new FormData();
    (async () => {
      try {
        let recdata = await props.pictureData();
        formData.append('video', {
          uri: recdata.uri,
          type: 'video/mp4',
          name: 'video.mp4',
        });
        resp = await fetch('http://0.0.0.0:5000/convertToFrames', {
          method: 'POST',
          body: formData,
        });
        let data = await resp.json();
        console.log('Response time: ', data.timetaken);
      } catch (e) {
        console.log('Error in vitals data: ', e);
      }
    })();
  }, [vitals]); */

  const screen = useWindowDimensions();
  const drawerAnim = React.useState(new Animated.Value(0))[0];
  console.log('Vitals: ', vitals);

  const slideUP = () => {
    Animated.timing(drawerAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const readFile = async (file) => {
    console.log('readFile called');
    try {
      let frame = await RNFS.readFile(file.path, 'base64');
      return frame;
    } catch (e) {
      console.error('Error getting file ' + file.name + ': ', e);
    }
  };

  const getFrames = async () => {
    console.log('getFrames called');
    try {
      let frames = await RNFS.readDir(`${RNFS.DocumentDirectoryPath}/frames`);
      console.log('All the frames are: ', frames);
      return Promise.all(
        frames.map((f, id) => {
          return readFile(f);
        }),
      );
    } catch (e) {
      console.error('Error accessing frames dir: ', e);
    }
  };

  const updateVitals = (respText) => {
    console.log('Response text', respText);
    let data = {};
    data['Blood Pressure'] = [
      {title: 'Systolic', value: respText[3].value},
      {title: 'Diastolic', value: respText[4].value},
    ];
    data['Saturation'] = respText[0].value + respText[0].prefix;
    data['Heart Rate'] = respText[1].value + respText[1].prefix;
    data['Respiration'] = respText[2].value + respText[2].prefix;
    data['Temperature'] = respText[5].value + respText[5].prefix;
    // data['Saturation'] = respText[0].value + respText[0].prefix;
    console.log('Vitals data updating are: ', data);
    setVitals(data);
  };

  const sendFrame = async (photoFrame) => {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let formData = JSON.stringify({
      id: '4',
      name: 'SomeName',
      pms: 'uk',
      status: '1',
      photo: photoFrame,
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow',
    };

    try {
      let response = await fetch(
        'http://15.207.11.162:8500/data/uploadPhoto',
        requestOptions,
      );
      if (response.ok) {
        let body = await response.json();
        // updateVitals(body);
        console.log('Result is: ', body[8].value);
        if (body[8].value) {
          updateVitals(body);
        }
      }
    } catch (e) {
      console.error(
        'Error sending request for photoframe ' + photoFrame.name + ': ',
        e,
      );
    }
  };

  const sendFramesAndUpdate = async () => {
    console.log('sendFramesAndUpdate called');
    try {
      let frames = await getFrames();
      setImgUri(frames[0]);
      frames.forEach((f, id) => {
        console.log('Sending request for frame - ', id);
        sendFrame(f);
      });
    } catch (e) {
      console.error('Error getting all frames at once: ', e);
    }
  };

  React.useEffect(() => {
    const onConvert = (msg) => {
      console.log(msg);
      sendFramesAndUpdate();
    };
    const onError = (msg) => {
      console.log(msg);
    };
    (async () => {
      try {
        let vid = await props.pictureData();
        JavaCV.getFramesFromVideo(vid.uri, onError, onConvert);
      } catch (e) {
        console.log('Error in showing files', e);
      }
    })();
  }, [converted]);

  return (
    <>
      {imgUri ? (
        <Image
          source={{
            uri: 'data:image/jpeg;base64,' + imgUri,
            height: 100,
            width: 100,
          }}
          style={styles.frame}
        />
      ) : null}
      <View style={styles.container}>
        {loading && (
          <ProgressBar
            style={styles.progressbar}
            width={null}
            height={21}
            borderRadius={15}
            color="rgba(55, 188, 223, 1)"
            unfilledColor="rgba(250, 250, 250, 0.3)"
            borderColor="transparent"
          />
        )}
        <Vitals data={vitals} />
        <Icon
          name="expand-less"
          size={30}
          color="#fff"
          style={styles.drawer}
          onPress={slideUP}
        />
      </View>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateY: drawerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [screen.height + 100, 0],
                }),
              },
            ],
          },
        ]}>
        <Icon
          name="cancel"
          size={30}
          color="#fff"
          style={{
            zIndex: 1000,
            alignSelf: 'flex-end',
            margin: 30,
          }}
          onPress={slideDown}
        />

        <FullVitals
          data={vitals}
          onReTest={() => {
            slideDown();
            props.onReTest();
          }}
        />
      </Animated.View>
    </>
  );
};

export default VitalsCardContainer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 1,
  },
  progressbar: {
    margin: 10,
  },
  drawer: {
    backgroundColor: 'rgba(250,250,250,0.5)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 25,
    alignSelf: 'center',
  },
  frame: {
    position: 'absolute',
    top: 20,
    left: 5,
  },
});

// const [state, dispatch] = React.useReducer(reducer, {
//   loading: true,
//   vitals: idata,
// });

// const sendFrameRequest = async (imageData) => {
//   // console.log('Sending request', imageData);
//   const data = {
//     id: 4,
//     name: 'something',
//     pms: 'uk',
//     status: 1,
//     photo: imageData,
//   };
//   try {
//     let resp = await fetch('http://15.207.11.162:8500/data/uploadPhoto', {
//       method: 'POST',
//       mode: 'cors',
//       headers: {'Content-type': 'application/json'},
//       body: JSON.stringify(data),
//     });
//     // resp.
//     if (resp.ok) {
//       return resp.json();
//     }
//     return resp;
//   } catch (e) {
//     console.log('Error in requesting: ', e);
//     return 'failed';
//   }
// };

// async function newFunction() {
//   let imgData = await props.pictureData();
//   let base64Str = imgData.base64;
//   console.log('Base64 string: ', base64Str.slice(0, 50));
//   let result = await sendFrameRequest(base64Str);
//   console.log('Image: ', imgData.width);
//   console.log('Result: ', result);
//   return result;

//   //////
//   let picPromises = [];
//   for (let i = 0; i < 10; i++) {
//     picPromises.push(props.pictureData());
//   }
//   let imgData = await Promise.all(picPromises);
//   // console.log('Image data for 10', imgData);
//   return Promise.all(
//     imgData.map(({base64}) => {
//       sendFrameRequest(base64);
//     }),
//   );
// }
