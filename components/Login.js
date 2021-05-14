import AppButton from './AppButton';
import {authContext} from '../contexts/AuthContext';

import React from 'react';

import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  PlatformColor,
} from 'react-native';

//--------------------------Done with imports-----------------------------------------------------

const Login = (props) => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {authDispatch} = React.useContext(authContext);

  const {navigation} = props;

  const handleLogin = () => {
    if (userName !== '' && password !== '') {
      authDispatch({type: 'loading', payload: true});
      authDispatch({
        type: 'login',
        payload: {userName, password, local: false},
      });
    } else {
      Alert.alert('Please fill, both username and password');
    }
  };

  return (
    <View style={styles.loginWrapper}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeader}>CliniQ</Text>
        <TextInput
          placeholder="Username"
          value={userName}
          onChangeText={(text) => setUserName(text)}
          style={styles.inputStyle}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.inputStyle}
        />
        <AppButton
          title="Login"
          onPress={handleLogin}
          style={styles.loginBtn}
          textStyle={styles.loginText}
          rounded
        />
        <View style={styles.extraOptionStyles}>
          <Pressable>
            <Text
              onPress={() => {
                navigation.navigate('Reset');
              }}>
              Forgot password?
            </Text>
          </Pressable>
          <Pressable>
            <Text
              onPress={() => {
                navigation.navigate('NewAccount');
              }}>
              Create Account
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    // borderWidth: ,
    width: '90%',
    borderStyle: 'solid',
    borderColor: 'red',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputStyle: {
    width: '90%',
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: '#00000010',
    borderColor: '#00000025',
    borderWidth: 1,
    borderRadius: 4,
  },
  loginBtn: {
    width: '50%',
    backgroundColor: '#3f51b5',
  },
  loginText: {
    color: '#fff',
  },
  extraOptionStyles: {
    marginTop: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
    color: PlatformColor(''),
  },
  loginHeader: {
    fontSize: 34,
    fontWeight: 'bold',
    margin: 10,
  },
});
export default Login;
