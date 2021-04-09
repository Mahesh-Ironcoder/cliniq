import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ResetPassword = () => {
  return (
    <View style={RPStyles.container}>
      <Text>Send you a link to reset your password</Text>
    </View>
  );
};
const RPStyles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResetPassword;
