import React, {Component} from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.initSyles}>
      <Text> CliniQ </Text>
      <ActivityIndicator color="#faf" size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  initSyles: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
