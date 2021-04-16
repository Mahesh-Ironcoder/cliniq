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

const VitalsCardContainer = () => {
  const [loading, setLoading] = React.useState(true);
  const [vitals, setVitals] = React.useState(idata);

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

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setVitals(data);
    }, 3000);
  }, [vitals]);

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

        <FullVitals data={vitals} />
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
