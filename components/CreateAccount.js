import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

//--------------------------Done with imports-----------------------------------------------------

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
