import 'react-native-gesture-handler';

import Login from './components/Login';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import ResetPassword from './components/ResetPassword';

import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '@react-native-firebase/auth';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import React, {useState, useEffect, createContext} from 'react';

import {StyleSheet, StatusBar, View, Text, BackHandler} from 'react-native';

import ReactNativeBiometrics from 'react-native-biometrics';
//--------------------------Done with imports------------------------------------------------------

const Stack = createStackNavigator();
export const AppContext = createContext(null);

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState('');

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
      <NavigationContainer>
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
      </NavigationContainer>
    </AppContext.Provider>
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

// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
// } from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// const App: () => React$Node = () => {
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <Header />
//           {global.HermesInternal == null ? null : (
//             <View style={styles.engine}>
//               <Text style={styles.footer}>Engine: Hermes</Text>
//             </View>
//           )}
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Step One</Text>
//               <Text style={styles.sectionDescription}>
//                 Edit <Text style={styles.highlight}>App.js</Text> to change this
//                 screen and then come back to see your edits.
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>See Your Changes</Text>
//               <Text style={styles.sectionDescription}>
//                 <ReloadInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Debug</Text>
//               <Text style={styles.sectionDescription}>
//                 <DebugInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Learn More</Text>
//               <Text style={styles.sectionDescription}>
//                 Read the docs to discover what to do next:
//               </Text>
//             </View>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// export default App;
