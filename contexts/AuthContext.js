import React, {useReducer, createContext, useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import auth from '@react-native-firebase/auth';

//--------------------------Done with imports-----------------------------------------------------

export const authContext = createContext(null);

const initialState = {
  status: false,
  user: {
    token: null,
    username: '',
    password: '',
    expiration: 0,
  },
  authenticatedLocally: false,
  biometrics: {status: false, type: 0},
  loading: false,
  local: false,
};

const AuthContextProvider = (props) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function AuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(AuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    console.info('auth context rendered ', Date.now());
    AsyncStorage.getItem('_user')
      .then((value) => {
        if (value !== null) {
          console.log('value: ', value);
          let parsedValue = JSON.parse(value);
          console.log('parsed value: ', parsedValue);

          if (parsedValue && parsedValue.biometrics.status) {
            console.log('pared value: ', parsedValue.biometrics.type);
            parsedValue.biometrics.type &&
              ReactNativeBiometrics.simplePrompt({
                promptMessage: 'Authenticate',
              })
                .then((st) => {
                  if (st.success) {
                    authDispatch({
                      type: 'login',
                      payload: {...value, local: true},
                    });
                  } else {
                    console.log('Not verified');
                    BackHandler.exitApp();
                  }
                })
                .catch((e) => {
                  console.error('@AuthContext - biometrics: Error ', e);
                  BackHandler.exitApp();
                });
          } else {
            console.info('no biometrics: ');
            setAskModal(true);
          }
        }
      })
      .catch((e) => {
        console.error('Error in auth effect: ', e);
      });
  }, []);

  if (initializing) return null;

  return (
    <authContext.Provider
      value={{
        signIn: auth().signInWithEmailAndPassword,
        signOut: auth().signOut,
      }}>
      {props.children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
