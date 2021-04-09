import React from 'react';
import Login from './Login';
import Home from './Home';
import CreateAccount from './CreateAccount';
import ResetPassword from './ResetPassword';
import {authContext} from '../contexts/AuthContext';

import {createStackNavigator} from '@react-navigation/stack';
import {View, StyleSheet} from 'react-native';

const Stack = createStackNavigator();

function AppNavigator(props) {
  const auth = React.useContext(authContext);
  // console.log('nav:', auth);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {auth.status ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="reset" component={ResetPassword} />
          <Stack.Screen name="newAccount" component={CreateAccount} />
        </>
      )}
      {/* </View> */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
