import React from 'react';
import {Button, Pressable, StyleSheet, Text, View} from 'react-native';
import {RadioButton} from 'react-native-paper';

const AskBiometrics = (props) => {
  const [checked, setChecked] = React.useState('');
  const handleAction = (status, value) => {
    props.onClose(status, value);
  };
  return (
    <View style={styles.modalStyle}>
      <View>
        <Text style={styles.modalHeader}>Authentication type</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setChecked(newValue)}
          value={checked}>
          <RadioButton.Item
            label="Use device's faceid or fingerprint"
            value="biometric"
          />
          <RadioButton.Item label="Use normal login" value="normal" />
        </RadioButton.Group>
      </View>
      <View style={styles.modalActions}>
        <Button title="Skip" onPress={() => handleAction(false, 'normal')} />
        <Button
          title="Next"
          disabled={checked ? false : true}
          onPress={() => handleAction(true, checked)}
        />
        {/* <Pressable onPress={props.onClose}>
          <Text>Skip</Text>
        </Pressable>
        <Pressable onPress={props.onClose}>
          <Text>Next</Text>
        </Pressable> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  //   modalActionBtns:{
  //     fontSize:
  //   },
  modalHeader: {
    fontSize: 20,
    paddingVertical: 20,
  },
});

export default AskBiometrics;
