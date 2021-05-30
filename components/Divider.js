import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function Divider() {
  return (
    <View style={styles.divider}>
      <View style={styles.line} />
      <Text style={{marginHorizontal: 10}}>OR</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 30,
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: 'grey',
  },
});
