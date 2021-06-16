import React from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import AppButton from './AppButton';
import Vitals from './Vitals';
// import {readFile, DocumentDirectoryPath} from 'react-native-fs';

const FullVitals = (props) => {
  const [profileImg, setProfileImg] = React.useState('');
  // React.useEffect(() => {
  //   let id = setTimeout(async () => {
  //     try {
  //       let img = await readFile(
  //         DocumentDirectoryPath + '/frames/frame010.png',
  //         'base64',
  //       );
  //       setProfileImg('data:image/png;base64,' + img);
  //       clearTimeout(id);
  //     } catch (e) {
  //       console.log('Error taking DP', e);
  //       clearTimeout(id);
  //     }
  //   }, 2000);
  // }, []);

  const {data: vData} = props;

  const DisplayAvatar = React.useCallback(
    () => <Image source={{uri: profileImg}} style={styles.image} />,
    [profileImg],
  );

  const comingSoonFeature = (feature) => {
    Alert.alert(`${feature} feature`, 'This feature is coming soon...');
  };

  // const FullVitalsComp = React.useMemo()
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      {/* <DisplayAvatar /> */}
      <View style={styles.vitalContainer}>
        <Vitals data={vData} />
        <View style={styles.btnGrp}>
          <AppButton
            title="Save"
            style={styles.btn}
            textStyle={styles.btnText}
            rounded
            onPress={() => comingSoonFeature('Save')}
          />
          <AppButton
            title="Share"
            style={styles.btn}
            textStyle={styles.btnText}
            rounded
            onPress={() => comingSoonFeature('Share')}
          />
          <AppButton
            title="Retake Test"
            style={styles.btn}
            textStyle={styles.btnText}
            rounded
            onPress={props.onReTest}
          />
        </View>
      </View>
    </View>
  );
};

export default FullVitals;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(55, 188, 223, 1)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  vitalContainer: {
    width: '100%',
    height: '80%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    padding: 20,
    paddingTop: 100,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnGrp: {
    width: '100%',
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  btn: {
    backgroundColor: 'rgba(55, 188, 223, 1)',
    minHeight: 35,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '200',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'blue',
    position: 'relative',
    top: '8%',
    zIndex: 100,
  },
});
