import React from 'react';
import {Pressable, Text, PlatformColor} from 'react-native';

const AppButton = ({
  title,
  onPress,
  style,
  textStyle,
  rounded,
  defaultStyle,
  defaultTextStyle,
}) => {
  return (
    <Pressable
      style={[
        defaultStyle,
        style,
        rounded === true && {borderRadius: 10, overflow: 'hidden'},
      ]}
      onPress={onPress}>
      <Text style={[textStyle, defaultTextStyle]}>{title}</Text>
    </Pressable>
  );
};

AppButton.defaultProps = {
  defaultStyle: {
    width: 100,
    backgroundColor: PlatformColor('?android:attr/colorPrimary'),
  },
  defaultTextStyle: {
    textAlign: 'center',
    padding: 8,
  },
};

export default AppButton;
