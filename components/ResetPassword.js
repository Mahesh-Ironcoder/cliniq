import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';

//--------------------------Done with imports-----------------------------------------------------

const ResetPassword = (props) => {
  const [noMail, setNoMail] = useState(false);
  const [email, setEmail] = useState('');

  const checkMail = () => {
    if (!email) {
      Alert.alert('Enter an email address');
    } else {
      auth()
        .fetchSignInMethodsForEmail(email)
        .then((methods) => {
          if (methods.length === 0) {
            setNoMail(true);
          } else {
            auth().sendPasswordResetEmail(email);
            props.navigation.navigate('Login');
            ToastAndroid.show(
              'Reset Link was sent to your email id',
              ToastAndroid.LONG,
            );
          }
        });
    }
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.subHeading}>CliniQ</Text>
        <Text style={styles.heading}>Forgot Password?</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Enter your email id</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.inputStyle}
        />
        {noMail ? (
          <Text style={styles.error}>No acount with the mailId</Text>
        ) : null}
        <View style={styles.next}>
          <Icon.Button
            name="navigate-next"
            size={40}
            backgroundColor="#37BCDF"
            color="white"
            onPress={checkMail}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: '30%',
    paddingLeft: '5%',
  },
  container: {
    width: '90%',
    alignItems: 'stretch',
  },
  header: {
    marginBottom: '20%',
  },
  heading: {
    fontSize: 48,
    fontWeight: '900',
  },
  subHeading: {
    fontSize: 24,
    fontWeight: '100',
    color: 'grey',
    marginBottom: '5%',
  },
  label: {
    padding: 2,
    fontSize: 18,
    fontWeight: '600',
  },
  inputStyle: {
    flexGrow: 1,
    marginVertical: 8,
    paddingHorizontal: 10,
    borderColor: '#00000025',
    borderWidth: 1,
    borderRadius: 8,
  },
  next: {
    alignSelf: 'flex-end',
  },
  error: {
    paddingLeft: 2,
    fontSize: 12,
    color: 'red',
  },
});

export default ResetPassword;
