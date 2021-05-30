import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

const Option = (props) => {
  const {label, onPress, icon: Icon} = props;
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 20,
        flexDirection: 'row',
        // width: '100%',
        justifyContent: 'flex-start',
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 10,
        margin: 5,
      }}>
      <Icon />
      <Text style={{fontSize: 24, marginLeft: 10, color: '#04C9BE'}}>
        {label}
      </Text>
    </Pressable>
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

const OptionsScreen = (props) => {
  const {navigation} = props;
  return (
    <View style={styles.container}>
      <MaterialIcons name="style" size={150} color="black" />
      <View style={styles.options}>
        <Option
          label="Profile"
          icon={() => <MaterialIcons name="face" size={25} color="#F2AB1D" />}
          onPress={() => navigation.navigate('Profile')}
        />
        <Option
          label="Settings"
          icon={() => (
            <MaterialIcons name="settings" size={25} color="#F2AB1D" />
          )}
          onPress={() => navigation.navigate('Settings')}
        />
        <Option
          label="Log out"
          icon={() => <MaterialIcons name="logout" size={25} color="#F2AB1D" />}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const MoreOptions = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Options"
          component={OptionsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </>
  );
};

export default MoreOptions;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    width: '99%',
    justifyContent: 'center',
  },
});
