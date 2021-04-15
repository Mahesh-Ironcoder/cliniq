import React from 'react';
import {View, Text} from 'react-native';
import {Bar} from 'react-native-progress';

const ProgressBar = React.forwardRef((props, ref) => {
  const [progress, setProgress] = React.useState(0);
  function animate(tovalue) {
    setProgress(tovalue);
  }
  return <Bar ref={ref} {...props} indeterminate={true} />;
});

export default ProgressBar;
