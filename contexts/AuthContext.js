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
  authenicatedLocally: false,
  // biometricsSet: {status: false, askAgain: 0, askModal: true},
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
      AsyncStorage.setItem(
        '_user',
        JSON.stringify({...state, biometricsSet: action.payload}),
      ).catch((e) => {
        console.error(
          '@AuthContext:reducer - Error storing the value in app storage\n',
          e,
        );
      });
      return {...state, biometricsSet: action.payload};
    case 'loading':
      return {...state, loading: action.payload};
    default:
      return state;
  }
}

const AuthContextProvider = (props) => {
  const [authState, authDispatch] = useReducer(reducer, initialState);
  const [askModal, setAskModal] = React.useState(authState.biometricsSet);
  React.useEffect(() => { 
    AsyncStorage.getItem('_user')
      .then((value) => {
        if (value !== null) {
          let parsedValue = JSON.parse(value);
          if (parsedValue.biometricsSet) {
            ReactNativeBiometrics.simplePrompt({promptMessage: 'Authenticate'})
              .then((st) => {
                if (st.success) {
                  authDispatch({
                    type: 'login',
                    payload: {...value, local: true},
                  });
                } else {
                  console.log('Not verified');
                  BackHandler.exitApp();
                  // authDispatch({type: 'logout'})
                }
              })
              .catch((e) => {
                console.error('@AuthContext - biometrics: Error ', e);
                BackHandler.exitApp();
              });
          } else {
            // authDispatch({type: 'biometricsSet', payload: {...value.biometricsSet, askModal:true}})
            setAskModal(true);
          }
        }
      })
      .catch((e) => {
        console.error('Error in auth effect: ', e);
      });
  }, [askModal]);

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
        <View style={styles.container}>
          <Text>Fast-Authentication</Text>
          <Text>
            Set password free authentication with your device fingerprint or
            faceeId
          </Text>
          <View>
            <Pressable
              style={{width: '40%', padding: 16, borderWidth: 2}}
              onPress={() => {
                authDispatch({type: 'biometrics', payload: true});
                setAskModal(false);
              }}>
              <Text>ok</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                authDispatch({type: 'biometrics', payload: false});
                setAskModal(false);
              }}>
              <Text>Not now</Text>
            </Pressable>
          </View>
        </View>
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
