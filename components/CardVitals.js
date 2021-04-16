import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ProgressBar from './ProgressBar';

const CardVitals = (props) => {
  const [data, setData] = React.useState(props.v);

  React.useEffect(() => {
    console.log('data: ', data);
    setData(props.v);
  }, [props]);

  if (data.value === null) {
    console.log('card data null');
    return (
      <View style={[styles.card, props.customStyle]}>
        <ProgressBar
          width={null}
          height={12}
          borderRadius={15}
          color="rgba(84, 84, 84, 0.1)"
          unfilledColor="rgba(84, 84, 84, 0.4)"
        />
        <View style={{width: '50%', marginVertical: 5}}>
          <ProgressBar
            width={null}
            height={6}
            borderRadius={15}
            color="rgba(84, 84, 84, 0.1)"
            unfilledColor="rgba(84, 84, 84, 0.3)"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, props.customStyle]}>
      {data.value instanceof Array ? (
        <View>
          <Text style={styles.title}>{data.title}</Text>
          {data.value.map((v, i) => {
            return (
              <View key={i}>
                <Text style={styles.subTitle}>{v.title}</Text>
                <Text style={styles.value}>{v.value}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <View>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.value}>{data.value}</Text>
        </View>
      )}
    </View>
  );
};

export default CardVitals;

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 12,
    width: 155,
    backgroundColor: 'rgba(247, 247, 247, 0.8)',
    borderRadius: 10,
    flex: 1,
    flexBasis: 70,
    fontSize: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: '300',
    padding: 2,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '300',
    fontWeight: 'normal',
    color: 'rgba(95, 95, 95, 1)',
  },
  value: {
    fontSize: 34,
    fontWeight: '100',
  },
});
