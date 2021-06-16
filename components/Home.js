import VideoStream from './VideoStream';

import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import {useIsFocused} from '@react-navigation/core';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MoreOptions from './MoreOptions';
// import {registerGlobals} from 'react-native-webrtc';

//--------------------------Done with imports---------------------------------------------
const Tab = createBottomTabNavigator();

const Home = (props) => {
  // useEffect(() => {
  //   registerGlobals();
  // }, []);

  const isFocused = useIsFocused();

  function HomeScreen() {
    return (
      <View style={homescreenStyles.homeContainer}>
        <VideoStream />
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
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
  },
});

export default Home;
