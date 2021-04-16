import AppButton from './AppButton';
import CustomCamera from './CustomCamera';
import Scanning from './Scanning';
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
import ProgressBar from './ProgressBar';

//--------------------------Done with imports-----------------------------------------------------

const Home = (props) => {
  const {biometricsSet, authDispatch} = React.useContext(authContext);
  const [isScanning, setIsScanning] = React.useState(false);
  // const [askModel, setAskModel] = React.useState(!biometricsSet.status);

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
    authDispatch({type: 'loading', payload: true});
    authDispatch({type: 'logout'});
  };

  const handleScan = () => {
    console.log('Handling scan: ');
    setIsScanning(true);
    camRef.current.resumePreview();
    setTimeout(() => {
      setIsScanning(false);
    }, 5000);
  };

  // const handleModalActions = (ma) => {
  //   console.log('handleModalActions');

  //   if (ma) {
  //     authDispatch({type: 'biometrics', payload: {status: true, askAgain: 0}});
  //   } else {
  //     authDispatch({
  //       type: 'biometrics',
  //       payload: {status: false, askAgain: Date.now() + 86400000},
  //     });
  //   }
  //   setAskModel(false);
  // };

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
            <>
              <ProgressBar
                ref={progressRef}
                width={200}
                style={{position: 'absolute', top: 50}}
              />
              <Scanning />
            </>
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
