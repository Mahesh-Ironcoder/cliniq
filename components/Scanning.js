import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CardVitals from './CardVitals';

const data = {
  'Blood Pressure': [
    {title: 'Diastolic', value: 120},
    {title: 'Systolic', value: 80},
  ],
  Temperature1: '80F',
  Temperature2: '80F',
  SpO2: '90%',
  Temperature3: '80F',
};
const idata = {
  'Blood Pressure': null,
  Temperature1: null,
  Temperature2: null,
  SpO2: null,
  Temperature3: null,
};

const Scanning = () => {
  const [vitals, setVitals] = React.useState(idata);

  React.useEffect(() => {
    setTimeout(() => {
      setVitals(data);
    }, 500);
  }, [vitals]);

  return (
    <View style={styles.container}>
      {Object.entries(vitals).map((v, i) => {
        if (v[0] === 'Blood Pressure') {
          return (
            <CardVitals
              key={i}
              v={{title: v[0], value: v[1]}}
              customStyle={{flexGrow: 2, minHeight: 150}}
            />
          );
        }
        return <CardVitals key={i} v={{title: v[0], value: v[1]}} />;
      })}
    </View>
  );
};

export default Scanning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'space-around',
    flexWrap: 'wrap',
    width: 350,
    height: 282,
    position: 'absolute',
    bottom: '3%',
  },
  card: {
    margin: 8,
    padding: 15,
    width: 155,
    backgroundColor: 'rgba(247, 247, 247, 0.8)',
    borderRadius: 10,
    flex: 1,
    flexBasis: 70,
    fontSize: 12,
  },
});
