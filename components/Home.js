import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {authContext} from '../contexts/AuthContext';

import {Button} from './StyledComponents/styledComponents';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCamera from './CustomCamera';
import AppButton from './AppButton';

const homescreenStyles = StyleSheet.create({
  homeContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hmBtnGrp: {
    width: '100%',
    position: 'absolute',
    bottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

const Home = (props) => {
  const {username, password, token, authDispatch} = React.useContext(
    authContext,
  );
  const handleLogout = () => {
    authDispatch({type: 'logout'});
  };
  return (
    <View style={homescreenStyles.homeContainer}>
      <CustomCamera />
      <View style={homescreenStyles.hmBtnGrp}>
        <AppButton style={{flexBasis: 200}} title="Start Scan" rounded />
        <AppButton title="Flip" rounded />
      </View>
    </View>
  );
};

export default Home;
