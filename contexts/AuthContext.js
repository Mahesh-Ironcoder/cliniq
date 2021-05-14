import React, {useReducer, createContext} from 'react';
import {
  Modal,
  Text,
  View,
  Pressable,
  StyleSheet,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import AskBiometrics from '../components/AskBiometrics';

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
  /**
   * biometric->type = 0 means use normal login
   * biometric->type = 1 means use device biometrics
   */
  // biometricsSet: false,

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
      let ns = {
        ...state,
        biometrics: {
          status: action.payload.status,
          type: action.payload.type === 'biometric' ? 1 : 0,
        },
      };
      AsyncStorage.setItem('_user', JSON.stringify(ns)).catch((e) => {
        console.error(
          '@AuthContext:reducer - Error storing the value in app storage\n',
          e,
        );
      });
      return ns;
    case 'loading':
      return {...state, loading: action.payload};
    default:
      return state;
  }
}

const AuthContextProvider = (props) => {
  const [authState, authDispatch] = useReducer(reducer, initialState);
  const [askModal, setAskModal] = React.useState(false);

  React.useEffect(() => {
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

  return (
    <authContext.Provider value={{...authState, authDispatch}}>
      {props.children}
      <Modal
        animationType="slide"
        visible={askModal}
        onRequestClose={() => {
          console.info('Home modal asked and closed');
          setAskModal(false);
        }}>
        <AskBiometrics
          onClose={(status, value) => {
            authDispatch({type: 'biometrics', payload: {status, type: value}});
            setAskModal(false);
          }}
        />
      </Modal>
    </authContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '40%',
    width: '75%',
    position: 'absolute',
    top: '25%',
    left: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: '#00f',
    height: '25%',
    width: '75%',
  },
});

export default AuthContextProvider;
