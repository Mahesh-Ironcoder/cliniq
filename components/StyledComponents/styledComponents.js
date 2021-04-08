import React from 'react';
import styled from 'styled-components/native';

const ButtonContainer = styled.TouchableOpacity`
  margin-vertical: 40px;
  width: 120px;
  height: 40px;
  padding: 12px;
  border-radius: 10px;
  background-color: cornflowerblue;
  color: white;
`;
const ButtonText = styled.Text`
  font-size: 16px;
  text-align: center;
`;
const Button = ({onPress, bgColor, title}) => (
  <ButtonContainer onPress={onPress} bgColor={bgColor}>
    <ButtonText>{title}</ButtonText>
  </ButtonContainer>
);

export {Button};
