import React from 'react';
import {StyleSheet, View} from 'react-native';
import CardVitals from './CardVitals';

const Vitals = (props) => {
  const {data} = props;

  return (
    <View style={styles.cardContainer}>
      {Object.entries(data).map((v, i) => {
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

export default Vitals;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'space-around',
    flexWrap: 'wrap',
    width: 350,
    height: 282,
  },
});
