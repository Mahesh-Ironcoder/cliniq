import React from 'react';
import {Pressable, Text, PlatformColor} from 'react-native';

const AppButton = ({title, style, textStyle, rounded, defaultStyle}) => {
  return (
    <Pressable
      style={[
        defaultStyle,
        style,
        rounded === true && {borderRadius: 10, overflow: 'hidden'},
      ]}>
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

AppButton.defaultProps = {
  defaultStyle: {
    width: 100,
    backgroundColor: PlatformColor('?android:attr/colorPrimary'),
  },
  textStyle: {
    textAlign: 'center',
    padding: 8,
  },
};

export default AppButton;
