import React from 'react';
import {View, Text, Button} from 'react-native';
import {authContext} from '../contexts/AuthContext';
import {themeContext} from '../contexts/ThemeContext';

const Login = (props) => {
  const {status, login} = React.useContext(authContext);
  const {mode} = React.useContext(themeContext);
  const handleLogin = () => {
    login({user: 'demo', pass: 'test123'});
  };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Text>Login screen</Text>
      <Text>Login status: {status ? 'yes' : 'nope'}</Text>
      <Text>Theme mode {mode}</Text>
      <Button onPress={handleLogin} title="Login" />
    </View>
  );
};

export default Login;
