import AppButton from './AppButton';
import CustomCamera from './CustomCamera';
import Scanning from './Vitals';
import {authContext} from '../contexts/AuthContext';

import React from 'react';
import {
  View,
  Text,
  DrawerLayoutAndroid,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';

import {useIsFocused} from '@react-navigation/core';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {RNCamera} from 'react-native-camera';
import ProgressBar from './ProgressBar';
import VitalsCardContainer from './VitalsCardContainer';
import auth from '@react-native-firebase/auth';

//--------------------------Done with imports-----------------------------------------------------

const Home = (props) => {
  const [isScanning, setIsScanning] = React.useState(false);

  const camRef = React.useRef(null);
  const drawerRef = React.useRef(null);
  const progressRef = React.useRef(null);

  const isFocused = useIsFocused();

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

  const handleLogout = () => {
    auth()
      .signOut()
      .then((res) => {
        console.log('Signed out');
      })
      .catch((e) => {
        console.log('Error in signing out: ', e);
      });
  };

  const handleReTest = () => {
    setIsScanning(false);
  };

  const handleScan = () => {
    console.log('Handling scan: ');
    setIsScanning(true);
  };

  const handleRecording = async () => {
    try {
      let recordData = await camRef.current.recordAsync({
        quality: RNCamera.Constants.VideoQuality['480p'],
        maxDuration: 8,
        orientation: RNCamera.Constants.Orientation.portrait,
        fixOrientation: true,
      });

      return recordData;
    } catch (e) {
      console.log('Error in recording: ', e);
    }
  };

  if (isFocused) {
    return (
      <DrawerLayoutAndroid
        ref={drawerRef}
        drawerPosition="left"
        draweWidth={300}
        renderNavigationView={drawerNavigationView}>
        <View style={homescreenStyles.homeContainer}>
          <CustomCamera
            ref={camRef}
            onScan={handleScan}
            hideControls={isScanning}
          />
          {isScanning ? (
            <VitalsCardContainer
              onReTest={handleReTest}
              pictureData={handleRecording}
            />
          ) : null}
          {/* <Icon
            name="expand-less"
            size={30}
            color="#fff"
            style={homescreenStyles.drawer}
            onPress={openDrawer}
          /> */}
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
  drawerNavigationStyles: {
    width: 300,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  drawerNavigationItems: {
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
