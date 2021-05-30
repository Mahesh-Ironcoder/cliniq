import AppButton from './AppButton';
import React from 'react';
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
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import Divider from './Divider';

//--------------------------Done with imports-----------------------------------------------------

const CreateAccount = (props) => {
  const {navigation} = props;

  const handleLogin = () => {
    if (userName !== '' && password !== '') {
    } else {
      Alert.alert('Please fill, both username and password');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>CliniQ</Text>
          <Text style={styles.headerText}>Create Your Account</Text>
        </View>

        <Formik
          initialValues={{firstName: '', lastName: '', email: '', password: ''}}
          validationSchema={Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid Email').required('Required'),
            password: Yup.string().required('Required'),
          })}
          onSubmit={(values, formikActions) => {
            auth()
              .createUserWithEmailAndPassword(values.email, values.password)
              .then((userCred) => {
                return userCred.user.updateProfile({
                  displayName: `${values.firstName} ${values.lastName}`,
                });
              })
              .then((ntg) => {
                formikActions.setSubmitting(false);
              })
              .catch((e) => {
                if (error.code === 'auth/email-already-in-use') {
                  console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                  console.log('That email address is invalid!');
                }
                console.log('Error in creating the user: ', e);
              });
          }}>
          {(props) => (
            <>
              {/*---------------------Name container-------------------------------*/}
              <View style={styles.rowContainer}>
                <TextInput
                  placeholder="First name"
                  style={styles.inputStyle}
                  onChangeText={props.handleChange('firstName')}
                  onBlur={props.handleBlur('firstName')}
                  value={props.values.firstName}
                  autoFocus
                />
                <TextInput
                  placeholder="Last name"
                  style={styles.inputStyle}
                  onChangeText={props.handleChange('lastName')}
                  onBlur={props.handleBlur('lastName')}
                  value={props.values.lastName}
                />
              </View>
              <View style={styles.rowErrorContainer}>
                {props.touched.firstName && props.errors.firstName ? (
                  <Text style={styles.error}>{props.errors.firstName}</Text>
                ) : null}
                {props.touched.lastName && props.errors.lastName ? (
                  <Text style={styles.error}>{props.errors.lastName}</Text>
                ) : null}
              </View>

              {/*---------------------Email container-------------------------------*/}
              <View style={styles.colContainer}>
                <TextInput
                  placeholder="Email"
                  style={styles.inputStyle}
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  value={props.values.email}
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
                title="Sign Up"
                onPress={props.handleSubmit}
                style={styles.signUpBtn}
                textStyle={styles.signUpText}
                loading={props.isSubmitting}
                disabled={props.isSubmitting}
                rounded
              />
            </>
          )}
        </Formik>

        <Divider />

        <AppButton
          title="Have an Account? Sign In"
          onPress={() => {
            navigation.navigate('Login');
          }}
          style={styles.loginBtn}
          textStyle={styles.loginText}
          rounded
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  headerText: {
    fontSize: 34,
    fontWeight: 'bold',
    margin: 10,
  },
  rowContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  rowErrorContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
  },
  colContainer: {
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'center',
  },
  inputStyle: {
    flexGrow: 1,
    margin: 5,
    paddingHorizontal: 10,
    backgroundColor: '#00000010',
    borderColor: '#00000025',
    borderWidth: 1,
    borderRadius: 8,
  },
  goToLogin: {
    alignSelf: 'flex-start',
    fontStyle: 'italic',
    marginHorizontal: 25,
    marginTop: 20,
    // flexBasis: ,
  },
  loginBtn: {
    width: '50%',
    backgroundColor: '#3f51b5',
  },
  loginText: {
    color: '#fff',
  },
  signUpBtn: {
    marginTop: 5,
    width: '50%',
    backgroundColor: '#F9B801',
  },
  signUpText: {
    color: '#fff',
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    flexGrow: 1,
  },
});

export default CreateAccount;
