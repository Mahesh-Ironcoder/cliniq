import AppButton from './AppButton';
import CustomCamera from './CustomCamera';
import Scanning from './Scanning';
import {authContext} from '../contexts/AuthContext';

import React from 'react';
import {View, Text, DrawerLayoutAndroid, StyleSheet} from 'react-native';

import {RNCamera} from 'react-native-camera';
import {useIsFocused} from '@react-navigation/core';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar';

//--------------------------Done with imports-----------------------------------------------------

const Home = (props) => {
  const {biometricsSet, authDispatch} = React.useContext(authContext);

  const [type, setType] = React.useState(RNCamera.Constants.Type.front);
  const [askModel, setAskModel] = React.useState(!biometricsSet.status);
  // const [progress, setProgress] = React.useState(0);

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

  const handleFlip = () => {
    console.log('enter cam ref ');
    authDispatch({type: 'loading', payload: true});
    setType(
      type === RNCamera.Constants.Type.front
        ? RNCamera.Constants.Type.back
        : RNCamera.Constants.Type.front,
    );
    authDispatch({type: 'loading', payload: false});
  };

  const handleLogout = () => {
    authDispatch({type: 'loading', payload: true});
    authDispatch({type: 'logout'});
  };

  const handleScan = () => {
    console.log('Handling scan: ');
    // camRef.current.pausePreview();
    // for (let i = 0; i < 10; i++) {
    //   let img = camRef.current
    //     .takePictureAsync({pauseAfterCapture: true})
    //     .then((res) => {
    //       console.log('\n\n--------------------------------------\n');
    //       console.log('image result: ', res);
    //       console.log('\n\n--------------------------------------\n');
    //       return res;
    //     })
    //     .catch((e) => {
    //       console.log('error in taking picture: ', e);
    //       return e;
    //     });
    // }
    let img = camRef.current
      .recordAsync({pauseAfterCapture: true})
      .then((res) => {
        console.log('\n\n--------------------------------------\n');
        console.log('image result: ', res);
        console.log('\n\n--------------------------------------\n');
        return res;
      })
      .catch((e) => {
        console.log('error in taking picture: ', e);
        return e;
      });

    camRef.current.resumePreview();
  };

  const handleModalActions = (ma) => {
    console.log('handleModalActions');

    if (ma) {
      authDispatch({type: 'biometrics', payload: {status: true, askAgain: 0}});
    } else {
      authDispatch({
        type: 'biometrics',
        payload: {status: false, askAgain: Date.now() + 86400000},
      });
    }
    setAskModel(false);
  };

  if (isFocused) {
    return (
      <DrawerLayoutAndroid
        ref={drawerRef}
        drawerPosition="left"
        draweWidth={300}
        renderNavigationView={drawerNavigationView}>
        <View style={homescreenStyles.homeContainer}>
          <CustomCamera ref={camRef} variant={type} />
          <View style={homescreenStyles.hmBtnGrp}>
            <AppButton
              style={{flexBasis: 200}}
              title="Start Scan"
              rounded
              onPress={handleScan}
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
          <ProgressBar
            ref={progressRef}
            width={200}
            style={{position: 'absolute', top: 50}}
          />
          {/* <Scanning /> */}

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
