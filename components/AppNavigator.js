import React from 'react';
import Login from './Login';
import Home from './Home';
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
        <Stack.Screen name="Login" component={Login} />
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
