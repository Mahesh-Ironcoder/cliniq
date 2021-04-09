import React from 'react';
import Login from './Login';
import Home from './Home';
import CreateAccount from './CreateAccount';
import ResetPassword from './ResetPassword';
import {authContext} from '../contexts/AuthContext';

import {createStackNavigator} from '@react-navigation/stack';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

const Stack = createStackNavigator();

function AppNavigator(props) {
  const auth = React.useContext(authContext);
  console.log('nav:', auth);
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {auth.status ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Reset" component={ResetPassword} />
            <Stack.Screen name="NewAccount" component={CreateAccount} />
          </>
        )}
      </Stack.Navigator>
      {auth.loading && (
        <ActivityIndicator
          size="large"
          color="#00ff00"
          style={styles.activityI}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityI: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});

export default AppNavigator;
