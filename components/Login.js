import {authContext} from '../contexts/AuthContext';

import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  SliderComponent,
} from 'react-native';

const Login = (props) => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {authDispatch} = React.useContext(authContext);

  const handleLogin = () => {
    if (userName !== '' && password !== '') {
      authDispatch({type: 'login', payload: {userName, password}});
    } else {
      Alert.alert('Please fill, both username and password');
    }
  };

  return (
    <View style={styles.loginWrapper}>
      <View style={styles.loginContainer}>
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
        <Button title="Login" onPress={handleLogin} style={styles.loginBtn} />
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
    width: '100%',
  },
});
export default Login;

// import React from 'react';
// import {View, Text, Button} from 'react-native';
// import {authContext} from '../contexts/AuthContext';
// import {themeContext} from '../contexts/ThemeContext';

// import * as LocalAuthentication from 'expo-local-authentication';

// const checkHardware = async () => {
//   let hardwareResults;
//   try {
//     hardwareResults = await LocalAuthentication.hasHardwareAsync();
//   } catch (e) {
//     console.log('hardware error: ', e);
//   }
//   console.log('hardware: ', hardwareResults);
// };

// async function supportedAuthentications() {
//   if (checkHardware()) {
//     let auths, enroll;
//     try {
//       auths = await LocalAuthentication.supportedAuthenticationTypesAsync();
//       enroll = await LocalAuthentication.isEnrolledAsync();
//     } catch (e) {
//       console.log('Support error: ', e);
//     }
//     console.log('supports: ', auths);
//     console.log('Enrolled: ', enroll);
//     return auths && enroll;
//   } else {
//     console.log('No hardware');
//     return false;
//   }
// }

// const Login = (props) => {
//   const {status, login} = React.useContext(authContext);
//   const {mode} = React.useContext(themeContext);
//   const handleLogin = () => {
//     login({user: 'demo', pass: 'test123'});
//   };

//   React.useEffect(() => {
//     (async () => {
//       let authRes;
//       try {
//         authRes = await LocalAuthentication.authenticateAsync(
//           (options = {promptMessage: 'Authenticate into CliniQ'}),
//         );
//       } catch (e) {
//         console.log('Login failed');
//       }
//     })();
//     supportedAuthentications();
//   });

//   return (
//     <View style={{justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Login screen</Text>
//       <Text>Login status: {status ? 'yes' : 'nope'}</Text>
//       <Text>Theme mode {mode}</Text>
//       <Button onPress={handleLogin} title="Login" />
//     </View>
//   );
// };

// export default Login;
