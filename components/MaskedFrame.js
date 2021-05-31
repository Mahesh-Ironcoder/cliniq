import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const MaskedFrame = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.top, styles.backdrop]} />
      <View style={[styles.right, styles.backdrop]} />
      <View style={[styles.bottom, styles.backdrop]} />
      <View style={[styles.left, styles.backdrop]} />
    </View>
  );
};

export default MaskedFrame;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '80%',
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '20%',
  },
  right: {
    position: 'absolute',
    top: '20%',
    right: 0,
    width: '20%',
    height: '60%',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '20%',
  },
  left: {
    position: 'absolute',
    top: '20%',
    left: 0,
    width: '20%',
    height: '60%',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
