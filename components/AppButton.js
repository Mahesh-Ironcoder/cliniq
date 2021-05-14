import React from 'react';
import {Pressable, Text, PlatformColor} from 'react-native';
import {color} from 'react-native-reanimated';

//--------------------------Done with imports-----------------------------------------------------

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
      android_ripple={{color: 'rgba(0, 0, 0, 0.16)', radius: 46}}
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
