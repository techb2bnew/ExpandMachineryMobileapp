import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { blackColor, grayColor, lightGrayColor, whiteColor, redColor } from '../constans/Color';
import { spacings, style } from '../constans/Fonts';

const CustomTextInput = ({
  label,
  placeholder,
  icon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  value,
  onChangeText,
  error,
  required,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <View style={[
        styles.inputContainer,
        { borderColor: error ? redColor : grayColor }
      ]}>
        {/* Left Icon */}
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={lightGrayColor}
            style={{ marginRight: spacings.large }}
          />
        ) : null}

        {/* Text Input */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={lightGrayColor}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />

        {/* Right Icon (Eye or Any Other) */}
        {rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={lightGrayColor}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Error Text */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacings.xxxLarge,
  },
  label: {
    color: whiteColor,
    fontSize: style.fontSizeNormal.fontSize,
    marginBottom: spacings.small2x,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: spacings.large,
    paddingVertical: Platform.OS === 'ios' ? spacings.large : 0,
  },
  input: {
    flex: 1,
    color: whiteColor,
  },
  errorText: {
    color: redColor,
    fontSize: style.fontSizeSmall2x.fontSize,
    marginTop: spacings.small,
  },
   required: {
    color: redColor, // * ko red karne ke liye
  },
});

export default CustomTextInput;
