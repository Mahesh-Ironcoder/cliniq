import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import AppButton from './AppButton';
import Vitals from './Vitals';

const FullVitals = (props) => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Image source={require('../profile.png')} style={styles.image} />
      <View style={styles.vitalContainer}>
        <Vitals data={props.data} />
        <View style={styles.btnGrp}>
          <AppButton
            title="Save"
            style={styles.btn}
            textStyle={styles.btnText}
            rounded
          />
          <AppButton
            title="Share"
            style={styles.btn}
            textStyle={styles.btnText}
            rounded
          />
          <AppButton
            title="Retake Test"
            style={styles.btn}
            textStyle={styles.btnText}
            rounded
            onPress={props.onReTest}
          />
        </View>
      </View>
    </View>
  );
};

export default FullVitals;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(55, 188, 223, 1)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  vitalContainer: {
    width: '100%',
    height: '80%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    padding: 20,
    paddingTop: 100,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnGrp: {
    width: '100%',
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  btn: {
    backgroundColor: 'rgba(55, 188, 223, 1)',
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: '200',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'blue',
    position: 'relative',
    top: '8%',
    zIndex: 100,
  },
});
