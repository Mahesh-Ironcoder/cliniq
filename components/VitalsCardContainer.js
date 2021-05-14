import React from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Animated,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FullVitals from './FullVitals';

import ProgressBar from './ProgressBar';
import Vitals from './Vitals';

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

  React.useEffect(() => {
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
  }, [vitals]);

  const screen = useWindowDimensions();
  const drawerAnim = React.useState(new Animated.Value(0))[0];

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

  return (
    <>
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
