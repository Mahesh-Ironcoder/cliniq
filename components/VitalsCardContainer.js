import React from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Animated,
  Pressable,
  Image,
  NativeEventEmitter,
  NativeModules,
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
  const [imgUri, setImgUri] = React.useState('');

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

  const updateVitals = (respText) => {
    console.log('Response text', respText);
    let data = {};
    data['Blood Pressure'] = [
      {title: 'Systolic', value: respText[3].value},
      {title: 'Diastolic', value: respText[4].value},
    ];
    data['Saturation'] = respText[0].value + '%';
    data['Heart Rate'] = respText[1].value + respText[1].prefix;
    data['Respiration'] = respText[2].value + respText[2].prefix;
    data['Temperature'] = respText[5].value + respText[5].prefix;
    // data['Saturation'] = respText[0].value + respText[0].prefix;
    console.log('Vitals data updating are: ', data);
    setVitals(data);
  };

  const sendFrame = (filepath, status = 1) => {
    console.log('Send frame is called');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (filepath == 'photo') {
      const rawData = JSON.stringify({
        id: 4,
        name: 'something',
        pms: 'uk',
        status: status,
        photo: 'photo',
      });

      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: rawData,
      };
      fetch('http://15.207.11.162:8500/data/uploadPhoto', requestOptions)
        .then((resp) => {
          console.log('Fetch response is recieved...');
          if (resp.ok) {
            return resp.json();
          }
          return resp.text();
        })
        .then((body) => {
          console.log(
            `The response with result ${body[8].value} and frame no ${body[7].value}`,
          );
          if (body[8].value) {
            updateVitals(body);
          }
        })
        .catch((e) => {
          console.log(
            'Error in loading the frame and sending it to the server: ' + e,
          );
        });
    } else {
      RNFS.readFile(filepath, 'base64')
        .then((photoFrame) => {
          const rawData = JSON.stringify({
            id: 4,
            name: 'something',
            pms: 'uk',
            status: status,
            photo: photoFrame,
          });

          const requestOptions = {
            method: 'POST',
            headers: headers,
            body: rawData,
          };
          return fetch(
            'http://15.207.11.162:8500/data/uploadPhoto',
            requestOptions,
          );
        })
        .then((resp) => {
          console.log('Fetch response is recieved...');
          if (resp.ok) {
            return resp.json();
          }
          return resp.text();
        })
        .then((body) => {
          console.log(
            `The response with result ${body[8].value} and frame no ${body[7].value}`,
          );
          if (body[8].value) {
            updateVitals(body);
          }
        })
        .catch((e) => {
          console.log(
            'Error in loading the frame and sending it to the server: ' + e,
          );
        });
    }
  };

  // const readFile = async (filepath) => {};

  React.useEffect(() => {
    const onConvert = (obj) => {
      console.log(obj.msg);
      // sendFrame('photo', 0);
    };

    const onError = (msg) => {
      console.log(msg);
    };

    const eventEmitter = new NativeEventEmitter(NativeModules.RNJavaCVLib);
    const eventListener = eventEmitter.addListener('frameEvent', (event) => {
      // try {
      if (event.lastReq) {
        sendFrame('photo', 0);
      } else {
        sendFrame(event.uriPath);
      }
      // sendFrame(event.uriPath);
    });

    props
      .pictureData()
      .then((video) => {
        console.log('Video rec completed and sending for frame extraction...');
        JavaCV.getFramesFromVideo(video.uri, onError, onConvert);
      })
      .catch((e) => {
        console.log('@VitalsCardContainer - Error in getting the picture data');
      });

    return () => {
      console.log('Component is destroyed...Removing the event listener');
      eventListener.remove();
    };
  }, []);

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

/* React.useEffect(() => {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let formData = JSON.stringify({
      id: '5',
      name: 'SomeName',
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow',
    };
    (async () => {
      try {
        let response = await fetch(
          'http://127.0.0.1:5000/uploadTest',
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
        console.error('Error sending request to localhost ', e);
      }
    })();
  }, [vitals]); */

/*   const getFrames = async () => {
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
  }; */
