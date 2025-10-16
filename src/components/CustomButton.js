import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { spacings, style } from '../constans/Fonts';
import { lightGrayColor, whiteColor } from '../constans/Color';

const CustomButton = ({ title, onPress, disabled = false, loading = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#9f9f9f', 
    paddingVertical: spacings.xLarge,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: spacings.large,
  },
  disabledButton: {
    backgroundColor: lightGrayColor, 
  },
  text: {
    color:whiteColor,
    fontSize: style.fontSizeNormal.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
  },
});

export default CustomButton;
