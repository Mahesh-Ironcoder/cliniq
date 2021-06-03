import CustomCamera from './CustomCamera';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';

import {useIsFocused} from '@react-navigation/core';
import {RNCamera} from 'react-native-camera';
import ProgressBar from './ProgressBar';
import VitalsCardContainer from './VitalsCardContainer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MoreOptions from './MoreOptions';

//remove after done
import AppButton from './AppButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

//--------------------------Done with imports-----------------------------------------------------
const Tab = createBottomTabNavigator();
const Home = (props) => {
  const [isScanning, setIsScanning] = React.useState(false);

  // const [nav, setNav] = React.useState(true);

  const camRef = React.useRef(null);

  const isFocused = useIsFocused();

  const handleReTest = () => {
    setIsScanning(false);
  };

  const handleScan = () => {
    console.log('Handling scan: ');
    setIsScanning(true);
  };

  const handleRecording = async () => {
    try {
      const camPer = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      const audiPer = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (!camPer && !audiPer) {
        const CamGranted = await PermissionsAndroid.requestMultiple(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'CliniQ Camera Permission',
            message: 'ClinQ needs access to your camera ',
            // buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const MicGranted = await PermissionsAndroid.requestMultiple(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'CliniQ Audio Permission',
            message: 'ClinQ needs access to record audio ',
            // buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (
          CamGranted === PermissionsAndroid.RESULTS.GRANTED &&
          MicGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('You can use the camera and record audio');
        } else {
          console.log('Camera permission denied');
          BackHandler.exitApp();
        }
      }
      let recordData = await camRef.current.recordAsync({
        quality: RNCamera.Constants.VideoQuality['1080p'],
        maxDuration: 10,
        orientation: RNCamera.Constants.Orientation.portrait,
        fixOrientation: true,
      });

      return recordData;
    } catch (e) {
      console.log('Error in recording: ', e);
    }
  };
  // const handleGrabFrame = () => {
  //   camRef.current.pausePreview();
  // };

  function HomeScreen() {
    return (
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
            // cam={camRef.current}
          />
        ) : null}
      </View>
    );
  }

  function SettingsScreen() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Settings!</Text>
      </View>
    );
  }

  if (isFocused) {
    return (
      <Tab.Navigator
        tabBarOptions={{
          style: {height: '6%'},
          tabStyle: {alignItems: 'center'},
          labelStyle: {fontSize: 14},
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreOptions}
          options={{
            tabBarLabel: 'More',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="more-horiz" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  } else {
    return null;
  }
};

const homescreenStyles = StyleSheet.create({
  homeContainer: {
    width: '100%',
    // height: '100%',
    flex: 1,
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
  tabNavStyles: {
    height: '200',
    position: 'absolute',
    backgroundColor: 'red',
  },

  // remove after testing
  hmBtnGrp: {
    width: '100%',
    position: 'absolute',
    height: '15%',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    alignContent: 'space-between',
  },
  bottomText: {
    // flexBasis: '100%',
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
  },
});

export default Home;

/* <View style={homescreenStyles.hmBtnGrp}>
            <AppButton
              style={{
                flexBasis: 200,
                backgroundColor: '#F2AB1D',
              }}
              textStyle={{color: 'white', fontSize: 18}}
              title="Start Scan"
              rounded
              onPress={handleScan || null}
            />
            <Icon.Button
              name="camera-rear"
              size={25}
              backgroundColor="#37BCDF"
              color="white"
              // onPress={handleFlip}
              >
              Flip
            </Icon.Button>
            <Text style={homescreenStyles.bottomText}>
              Click on start to begin the process
            </Text>
          </View> */
