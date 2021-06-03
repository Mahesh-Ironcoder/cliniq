import 'react-native-gesture-handler';

import Login from './components/Login';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import ResetPassword from './components/ResetPassword';

import {createStackNavigator} from '@react-navigation/stack';

import React, {useState, useEffect} from 'react';

import AuthContextProvider from './contexts/AuthContext';

import {BackHandler, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
//--------------------------Done with imports------------------------------------------------------

const Stack = createStackNavigator();

function App() {
  const [user, setUser] = useState('');

  function updateUserBiometric(userId, bioAuth, ask) {
    console.log('got update params with userId: ', userId, bioAuth, ask);
    let value = {
      bioAuth: {
        enabled: bioAuth,
        authenticated: false,
        askNextTime: ask,
      },
    };
    AsyncStorage.mergeItem(userId, JSON.stringify(value)).catch((e) => {
      console.log('Error', e);
    });
  }

  function addUserBiometric(userId, bioAuth, ask) {
    console.log('got params with userId: ', userId, bioAuth, ask);
    let value = {
      bioAuth: {
        enabled: bioAuth,
        authenticated: false,
        askNextTime: ask,
      },
    };
    AsyncStorage.setItem(JSON.stringify(userId), JSON.stringify(value)).catch(
      (e) => {
        console.log('Error', e);
      },
    );
  }

  async function verifyUserBiometric(userId) {
    async function authenticateUser(prevData) {
      try {
        let authRes = await ReactNativeBiometrics.simplePrompt({
          promptMessage: 'Using your device authentication...',
          cancelButtonText: 'Cancel',
        });

        const {success} = authRes;
        if (success) {
          console.log('successful biometrics provided');
          AsyncStorage.setItem(
            userId,
            JSON.stringify({
              ...prevData,
              bioAuth: {...prevData.bioAuth, authenticated: true},
            }),
          ).catch((e) => {
            console.log('Error in updating the persistent data', e);
          });
        } else {
          console.log('user cancelled biometric prompt');
          BackHandler.exitApp();
        }
      } catch (e) {
        console.log('Error showing biometrics', e);
      }
    }

    let authPersistent;
    try {
      authPersistent = await AsyncStorage.getItem(userId);
      if (!authPersistent) {
        return;
      }
      authPersistent = await JSON.parse(authPersistent);
      const {
        bioAuth: {enabled, askNextTime},
      } = authPersistent;

      // console.log('Auth persist init: ', authPersistent);

      if (enabled) {
        await authenticateUser(authPersistent);
      } else if (askNextTime) {
        showSecurityAlert(userId, false);
      }
    } catch (e) {
      console.log('Error in biometric authentication', e);
      BackHandler.exitApp();
    }
  }

  function showSecurityAlert(userId, add) {
    Alert.alert(
      'Extra Security-init',
      "Add extra layer of security by using device's biometrics",
      [
        {
          text: 'Ok',
          onPress: () => {
            if (add) {
              addUserBiometric(userId, true, false);
            }
            updateUserBiometric(userId, true, false);
          },
        },
        {
          text: 'Cancel',
          onPress: () => {
            if (add) {
              addUserBiometric(userId, false, true);
            }
            updateUserBiometric(userId, false, true);
          },
          style: 'cancel',
        },
        {
          text: 'No & Dont ask again',
          onPress: () => {
            if (add) {
              addUserBiometric(userId, false, false);
            }
            updateUserBiometric(userId, false, false);
          },
        },
      ],
    );
  }

  useEffect(() => {
    if (user) {
      console.log('User: ', user);
      verifyUserBiometric(JSON.stringify(user.uid));
    }
  }, [user]);

  return (
    <AuthContextProvider
      onUser={(u) => setUser(u)}
      user={user}
      // addUser={addUserBiometric}
      ssa={showSecurityAlert}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Reset" component={ResetPassword} />
            <Stack.Screen name="NewAccount" component={CreateAccount} />
          </>
        )}
      </Stack.Navigator>
    </AuthContextProvider>
  );
}

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
