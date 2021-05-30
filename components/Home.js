import CustomCamera from './CustomCamera';

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {useIsFocused} from '@react-navigation/core';
import {RNCamera} from 'react-native-camera';
import ProgressBar from './ProgressBar';
import VitalsCardContainer from './VitalsCardContainer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MoreOptions from './MoreOptions';

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
});

export default Home;
