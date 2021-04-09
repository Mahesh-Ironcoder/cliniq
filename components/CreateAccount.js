import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';

const CreateAccount = () => {
  return (
    <View style={CAStyles.container}>
      <Text>Create a new Account</Text>
    </View>
  );
};

const CAStyles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateAccount;
