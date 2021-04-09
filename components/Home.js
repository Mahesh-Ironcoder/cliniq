import React from 'react';
import {View, Text, DrawerLayoutAndroid, StyleSheet} from 'react-native';
import {authContext} from '../contexts/AuthContext';

import {useIsFocused} from '@react-navigation/core';

import CustomCamera from './CustomCamera';
import AppButton from './AppButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RNCamera} from 'react-native-camera';

const Home = (props) => {
  const {username, password, token, authDispatch} = React.useContext(
    authContext,
  );
  const [drawerPosition, setDrawerPosition] = React.useState('left');
  const isFocused = useIsFocused();
  const handleLogout = () => {
    authDispatch({type: 'logout'});
  };

  const camRef = React.useRef(null);
  const drawerRef = React.useRef(null);

  const [type, setType] = React.useState(RNCamera.Constants.Type.front);
  const openDrawer = () => {
    if (drawerRef) {
      drawerRef.current.openDrawer();
    } else {
      console.log('no drawer');
    }
  };
  const drawerNavigationView = () => {
    return (
      <View style={homescreenStyles.drawerNavigationStyles}>
        <Text>CliniQ</Text>
        <Icon.Button
          name="account-circle"
          style={homescreenStyles.drawerNavigationItems}>
          Profile
        </Icon.Button>
        <Icon.Button
          name="logout"
          style={homescreenStyles.drawerNavigationItems}
          onPress={handleLogout}>
          Log out
        </Icon.Button>
      </View>
    );
  };
  const handleFlip = () => {
    console.log('enter cam ref ');
    setType(
      type === RNCamera.Constants.Type.front
        ? RNCamera.Constants.Type.back
        : RNCamera.Constants.Type.front,
    );
  };
  if (isFocused) {
    return (
      <DrawerLayoutAndroid
        ref={drawerRef}
        drawerPosition={drawerPosition}
        draweWidth={300}
        renderNavigationView={drawerNavigationView}>
        <View style={homescreenStyles.homeContainer}>
          <CustomCamera ref={camRef} variant={type} />
          <View style={homescreenStyles.hmBtnGrp}>
            <AppButton
              style={{flexBasis: 200}}
              title="Start Scan"
              rounded
              // onPress={openDrawer}
            />
            <Icon.Button
              name="camera-rear"
              size={25}
              backgroundColor="#fff"
              color="#000"
              onPress={handleFlip}>
              Flip
            </Icon.Button>
          </View>
          <Icon
            name="expand-less"
            size={30}
            color="#fff"
            style={homescreenStyles.drawer}
            onPress={openDrawer}
          />
        </View>
      </DrawerLayoutAndroid>
    );
  } else {
    return null;
  }
};

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
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  drawerNavigationStyles: {
    width: 300,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  drawerNavigationItems: {
    // margin: 16,
    width: 250,
    backgroundColor: '#303f9f',
  },
  drawer: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'transparent',
  },
  drawerText: {
    padding: 0,
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Home;
