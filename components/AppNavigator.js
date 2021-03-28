import React from 'react';
import Login from './Login';
import Home from './Home';
import {authContext} from '../contexts/AuthContext';

import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function AppNavigator(props) {
  const {status} = React.useContext(authContext);

  return (
    <Stack.Navigator>
      {status ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;
