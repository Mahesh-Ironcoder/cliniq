import React, {useReducer, createContext} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

export const authContext = createContext(null);

const initialState = {
  status: false,
  token: null,
  username: '',
  password: '',
  expiration: 0,
  splash: true,
  authenicatedLocally: false,
  biometricsSet: true,
  local: 'false',
};



function reducer(state, action) {
  // console.log('Reducer init: ', state);
  switch (action.type) {
    case 'login':
      let token = action.payload.token || 'dummy-user-token';
      let user = {
        ...state,
        ...action.payload,
        status: true,
        token,
      };
      if (!action.payload.local) {
        AsyncStorage.setItem('_user', JSON.stringify(user))
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
      return {...user};
    case 'logout':
      AsyncStorage.removeItem('_user').catch((e) => {
        console.error(
          '@APPContext:reducer - Error in removing an Item from app storage\n',
          e,
        );
      });
      return initialState;
    case 'splash':
      return {...state, splash: action.payload};
    case 'setUser':
      return {...state, ...action.payload};
    default:
      return state;
  }
}

const AuthContextProvider = (props) => {
  const [authState, authDispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    // console.log('IN effect before IA');
    // console.log(
    //   '\n\n---------------\n',
    //   InitializeAuth(initialState, 'effect'),
    //   '\n\n---------------',
    // );
    // console.log('IN effect after IA');
    AsyncStorage.getItem('_user')
      .then((value) => {
        if (value !== null) {
          ReactNativeBiometrics.simplePrompt({promptMessage: 'Authenticate'})
            .then((st) => {
              if (st.success) {
                authDispatch({type: 'login', payload: {...value, local: true}});
              } else {
                authDispatch({type: 'logout'});
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
    // console.info('authcontext state: ', authState);
  }, []);

  return (
    <authContext.Provider value={{...authState, authDispatch}}>
      {props.children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;

// const isUserLoggedIn = () => {
//   const authUser = isUserAvailable();
//   if (authUser !== null) {
//     if (authUser.biometricsSet) {
//       const resp = authenticateWithBiometrics();
//       if (resp.success) {
//         login({username: auth});
//       }
//     }
//   }
// };

// const login = (creds) => {
//   /** Verify the creds with server and get a token
//    * token = fetchTokenFromServer()
//    * store the token in the secure storage for accessing and create a session
//    */

//   const authUser = isUser;
//   Available();
//   if (authUser !== null) {
//     if (authUser.biometricsSet) {
//       const resp = authenticateWithBiometrics();
//       if (resp.success) {
//         login({username: auth});
//       }
//     }
//   }

//   let token;
//   if (creds.hasOwnProperty('userToken')) {
//     token = creds.userToken;
//   } else {
//     token = 'dummy-user-token';
//   }
//   if (token !== null) {
//     AsyncStorage.setItem(
//       'user',
//       JSON.stringify({userToken: token, userId: 'user-Id'}),
//     )
//       .then((stStatus) => {
//         console.log(stStatus);
//       })
//       .catch((e) => {
//         console.log('Error in setting the value: ', e);
//       });
//     setAuthentication({
//       ...authentication,
//       status: true,
//       username: creds.user,
//       password: creds.pass,
//       token,
//     });
//   } else {
//     setAuthentication(initialState);
//   }
// };

// const logout = () => {
//   /** Logout the current user and clear all the sessions related to that user */
//   AsyncStorage.removeItem('user')
//     .then((stStatus) => {
//       console.log(stStatus);
//     })
//     .catch((e) => {
//       console.log('Error in removing the value: ', e);
//     });
//   setAuthentication(initialState);
// };

// React.useEffect(() => {
//   console.log('effect from auth context:');
//   AsyncStorage.getItem('user').then((resp) => {
//     if (null) {
//       setSplash({user: undefined, screen: false});
//     }
//     console.log('user Initial:', resp);
//     setSplash({screen: false, user: resp});
//     login(resp);
//   });
//   // .catch((e) => {
//   //   setSplash({user: undefined, screen: false});
//   //   console.log('Inital fetch failed: ', e);
//   // });
// }, []);
