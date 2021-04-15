import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Scanning = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, {flexGrow: 2, minHeight: 150}]}>
        <Text>BP</Text>
      </View>
      <View style={[styles.card]}>
        <Text>temp1</Text>
      </View>
      <View style={[styles.card]}>
        <Text>SpO2</Text>
      </View>
      <View style={[styles.card]}>
        <Text>Temp0</Text>
      </View>
      <View style={[styles.card]}>
        <Text>Temp2</Text>
      </View>
    </View>
  );
};

export default Scanning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'space-around',
    flexWrap: 'wrap',
    width: 350,
    height: 282,
    // borderColor: 'red',
    // borderWidth: 1,
    position: 'absolute',
    bottom: '3%',
  },
  card: {
    margin: 8,
    padding: 15,
    width: 155,
    backgroundColor: 'rgba(247, 247, 247, 0.8)',
    borderRadius: 10,
    flex: 1,
    flexBasis: 70,
    fontSize: 12,
  },
});
