import React from 'react';
import {View, Text} from 'react-native';
import {Bar} from 'react-native-progress';

const ProgressBar = React.forwardRef((props, ref) => {
  return (
    <Bar
      ref={ref}
      {...props}
      useNativeDriver={true}
      indeterminate={true}
      animationType="timing"
    />
  );
});

export default ProgressBar;
