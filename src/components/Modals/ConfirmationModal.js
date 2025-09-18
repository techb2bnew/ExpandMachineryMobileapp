import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { whiteColor, lightBlack, lightColor, redColor, supportGreen, grayColor } from '../../constans/Color';
import { style, spacings } from '../../constans/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';

const { width, height } = Dimensions.get('window');

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'success'
  iconName = 'warning-outline',
}) => {
  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return redColor;
      case 'success':
        return supportGreen;
      case 'warning':
      default:
        return '#FFA500';
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      case 'warning':
      default:
        return styles.warningButton;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
            <Icon name={iconName} size={40} color={getIconColor()} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, getConfirmButtonStyle()]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacings.xxLarge,
  },
  modalContainer: {
    backgroundColor: lightBlack,
    borderRadius: 16,
    padding: spacings.xxLarge,
    width: wp(85),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacings.large,
  },
  title: {
    ...style.fontSizeLarge1x,
    ...style.fontWeightBold,
    color: whiteColor,
    textAlign: 'center',
    marginBottom: spacings.medium,
  },
  message: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacings.xxLarge,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: grayColor,
    borderRadius: 8,
    paddingVertical: spacings.medium,
    marginRight: spacings.small,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: spacings.medium,
    marginLeft: spacings.small,
    alignItems: 'center',
  },
  warningButton: {
    backgroundColor: '#FFA500',
  },
  dangerButton: {
    backgroundColor: redColor,
  },
  successButton: {
    backgroundColor: supportGreen,
  },
  confirmButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightBold,
    color: whiteColor,
  },
});

export default ConfirmationModal;
