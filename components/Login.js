import AppButton from './AppButton';
import {AppContext} from '../contexts/AuthContext';

import React, {useContext} from 'react';

import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  PlatformColor,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import * as Yup from 'yup';

//--------------------------Done with imports-----------------------------------------------------

const Login = (props) => {
  const {onSignIn} = useContext(AppContext);
  const {navigation} = props;

  return (
    <View style={styles.loginWrapper}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeader}>CliniQ</Text>
        <Formik
          initialValues={{email: '', password: ''}}
          validationSchema={Yup.object({
            email: Yup.string().email('Invalid Email').required('Required'),
            password: Yup.string().required('Required'),
          })}
          onSubmit={(values, formikActions) => {
            auth()
              .signInWithEmailAndPassword(values.email, values.password)
              .then((userCreds) => {
                console.log('Signed in as: ', userCreds.user.displayName);
                onSignIn(userCreds.user.uid, true, false);
                formikActions.setSubmitting(false);
              })
              .catch((e) => {
                console.error('Error in signing in: ', e);
              });
          }}>
          {(props) => (
            <>
              {/*---------------------Email container-------------------------------*/}
              <View style={styles.colContainer}>
                <TextInput
                  placeholder="Email"
                  style={styles.inputStyle}
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  value={props.values.email}
                  autoCompleteType="email"
                />
                {props.touched.email && props.errors.email ? (
                  <Text style={styles.error}>{props.errors.email}</Text>
                ) : null}
              </View>

              {/*---------------------Password container-------------------------------*/}
              <View style={styles.colContainer}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  style={styles.inputStyle}
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                />
                {props.touched.password && props.errors.password ? (
                  <Text style={styles.error}>{props.errors.password}</Text>
                ) : null}
              </View>

              <AppButton
                title="Sign In"
                onPress={props.handleSubmit}
                style={styles.loginBtn}
                textStyle={styles.loginText}
                loading={props.isSubmitting}
                disabled={props.isSubmitting}
                rounded
              />
            </>
          )}
        </Formik>
        <View style={styles.extraOptionStyles}>
          <Pressable>
            <Text
              onPress={() => {
                navigation.navigate('Reset');
              }}>
              Forgot password?
            </Text>
          </Pressable>
          <Pressable>
            <Text
              onPress={() => {
                navigation.navigate('NewAccount');
              }}>
              Create Account
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    // borderWidth: ,
    width: '90%',
    borderStyle: 'solid',
    borderColor: 'red',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputStyle: {
    width: '90%',
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: '#00000010',
    borderColor: '#00000025',
    borderWidth: 1,
    borderRadius: 4,
  },
  loginBtn: {
    width: '50%',
    backgroundColor: '#3f51b5',
  },
  loginText: {
    color: '#fff',
  },
  extraOptionStyles: {
    marginTop: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
    color: PlatformColor(''),
  },
  loginHeader: {
    fontSize: 34,
    fontWeight: 'bold',
    margin: 10,
  },
  colContainer: {
    // paddingHorizontal: ,
    width: '100%',
    justifyContent: 'center',
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    flexGrow: 1,
  },
});
export default Login;
