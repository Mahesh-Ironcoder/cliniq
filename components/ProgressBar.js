import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Bar} from 'react-native-progress';

const ProgressBar = React.forwardRef((props, ref) => {
  const {text, ...barProps} = props;
  return (
    <Bar
      ref={ref}
      useNativeDriver={true}
      indeterminate={true}
      animationType="timing"
      {...barProps}>
      {text ? <Text style={styles.loadingText}>{text}</Text> : null}
    </Bar>
  );
});

const styles = StyleSheet.create({
  loadingText: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default ProgressBar;
