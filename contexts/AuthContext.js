import 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '@react-native-firebase/auth';

import {NavigationContainer} from '@react-navigation/native';

import React, {useState, useEffect, createContext} from 'react';

import {StatusBar, View, Text, BackHandler} from 'react-native';

import ReactNativeBiometrics from 'react-native-biometrics';
//--------------------------Done with imports------------------------------------------------------

export const AppContext = createContext(null);

function AuthContextProvider(props) {
  const [initializing, setInitializing] = useState(true);
  const {user, onUser: setUser} = props;

  //------------------------utility functions------------------------------------------------------

  function clearUserBiometric() {
    // AsyncStorage.removeItem(userId).catch((e) => {
    //   console.log('Error in accessing the storage');
    // });
    AsyncStorage.clear().catch((e) => {
      console.log('Error in clearing the asyncStorage', e);
    });
  }

  function addUserBiometric(userId, bioAuth, ask) {
    let value = {
      bioAuth: {
        enabled: bioAuth,
        authenticated: false,
        askNextTime: ask,
      },
    };
    toString();
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
            JSON.stringify(userId),
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
      authPersistent = await AsyncStorage.getItem(JSON.stringify(userId));
      // } catch (e) {
      //   console.log(
      //     'Error in biometric authentication - cannot access asyncstorage',
      //     e,
      //   );
      // }

      // try {
      const {
        bioAuth: {enabled, authenticated},
      } = JSON.parse(authPersistent);
      if (enabled) {
        await authenticateUser(authPersistent);
      }
    } catch (e) {
      console.log('Error in biometric authentication', e);
      BackHandler.exitApp();
    }
  }

  // Handle user state changes
  function AuthStateChanged(user) {
    if (!user) {
      clearUserBiometric();
    }
    setUser(user);
    if (initializing) setInitializing(false);
  }

  //-----------------------------Effects----------------------------------------------------------
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(AuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user && !initializing) {
      console.log('User: ', user);
      verifyUserBiometric(user.uid);
    }
  }, [user, initializing]);

  useEffect(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');
  });

  if (initializing)
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <Text>Loading state...</Text>
      </View>
    );

  return (
    <AppContext.Provider value={{onSignIn: addUserBiometric}}>
      <NavigationContainer>{props.children}</NavigationContainer>
    </AppContext.Provider>
  );
}

export default AuthContextProvider;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
