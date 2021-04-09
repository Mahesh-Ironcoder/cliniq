import React, {useReducer, createContext} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

export const authContext = createContext(null);

const initialState = {
  status: false,
  user: {
    token: null,
    username: '',
    password: '',
    expiration: 0,
  },
  authenicatedLocally: false,
  biometricsSet: false,
  loading: false,
  local: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      let token = action.payload.token || 'dummy-user-token';
      let nextState = {
        ...state,
        status: true,
        user: {
          username: action.payload.username,
          password: action.payload.password,
          expiration: Date.now() + 3600000,
          token,
        },
        loading: false,
      };
      if (!action.payload.local) {
        AsyncStorage.setItem('_user', JSON.stringify(nextState))
          .then((e) => {
            console.log('setItem', e);
          })
          .catch((e) => {
            console.error(
              '@AuthContext:reducer - Error storing the value in app storage\n',
              e,
            );
          });
      }
      return {...nextState};
    case 'logout':
      AsyncStorage.removeItem('_user').catch((e) => {
        console.error(
          '@APPContext:reducer - Error in removing an Item from app storage\n',
          e,
        );
      });
      return initialState;
    case 'biometrics':
      return {...state, biometricsSet: action.payload, loading: false};
    case 'loading':
      return {...state, loading: action.payload};
    default:
      return state;
  }
}

const AuthContextProvider = (props) => {
  const [authState, authDispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    AsyncStorage.getItem('_user')
      .then((value) => {
        if (value !== null) {
          ReactNativeBiometrics.simplePrompt({promptMessage: 'Authenticate'})
            .then((st) => {
              if (st.success) {
                authDispatch({type: 'login', payload: {...value, local: true}});
              } else {
                console.log('Not verified');
                // authDispatch({type: 'logout'})
              }
            })
            .catch((e) => {
              console.error('@AuthContext - biometrics: Error ', e);
            });
        }
      })
      .catch((e) => {
        console.error('Error in auth effect: ', e);
      });
  }, []);

  return (
    <authContext.Provider value={{...authState, authDispatch}}>
      {props.children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
