import React from 'react';
import {View, Text, Button} from 'react-native';
import {authContext} from '../contexts/AuthContext';

const Home = (props) => {
  const {logout} = React.useContext(authContext);
  const handleLogout = () => {
    logout();
  };
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Home screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Home;
