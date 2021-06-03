import 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '@react-native-firebase/auth';

import {NavigationContainer} from '@react-navigation/native';

import React, {useState, useEffect, createContext} from 'react';

import {StatusBar, View, Text} from 'react-native';

//--------------------------Done with imports------------------------------------------------------

export const AppContext = createContext(null);

const APPAUTH = auth();
function AuthContextProvider(props) {
  const [initializing, setInitializing] = useState(true);
  const {user, onUser: setUser, ssa} = props;

  //------------------------utility functions------------------------------------------------------

  function clearUserBiometric() {
    // AsyncStorage.removeItem(userId).catch((e) => {
    //   console.log('Error in accessing the storage');
    // });
    AsyncStorage.clear().catch((e) => {
      console.log('Error in clearing the asyncStorage', e);
    });
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
    const subscriber = APPAUTH.onAuthStateChanged(AuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

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
    <AppContext.Provider
      value={{
        appAuth: APPAUTH,
        showSecurityAlert: ssa,
      }}>
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
