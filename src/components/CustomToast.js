import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { whiteColor, lightBlack, lightPinkAccent, grayColor, greenColor, redColor } from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';

class ToastManager {
  static instance = null;
  static listeners = [];

  static getInstance() {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  static show(config) {
    const instance = ToastManager.getInstance();
    instance.show(config);
  }

  static hide() {
    const instance = ToastManager.getInstance();
    instance.hide();
  }

  static addListener(listener) {
    ToastManager.listeners.push(listener);
  }

  static removeListener(listener) {
    const index = ToastManager.listeners.indexOf(listener);
    if (index > -1) {
      ToastManager.listeners.splice(index, 1);
    }
  }

  show(config) {
    ToastManager.listeners.forEach(listener => {
      if (listener.onShow) {
        listener.onShow(config);
      }
    });
  }

  hide() {
    ToastManager.listeners.forEach(listener => {
      if (listener.onHide) {
        listener.onHide();
      }
    });
  }
}

const CustomToast = () => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);

  useEffect(() => {
    const listener = {
      onShow: (newConfig) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setConfig(newConfig);
        setVisible(true);

        // Slide in animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();

        // Auto hide after visibility time (default 3 seconds)
        const visibilityTime = newConfig.visibilityTime || 3000;
        timeoutRef.current = setTimeout(() => {
          ToastManager.hide();
        }, visibilityTime);
      },
      onHide: () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setVisible(false);
        });
      },
    };

    ToastManager.addListener(listener);

    return () => {
      ToastManager.removeListener(listener);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fadeAnim, slideAnim]);

  if (!visible) return null;

  const getToastStyle = () => {
    switch (config.type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'info':
        return styles.infoToast;
      default:
        return styles.defaultToast;
    }
  };

  const getIconColor = () => {
    switch (config.type) {
      case 'success':
        return greenColor;
      case 'error':
        return redColor;
      case 'info':
        return '#2196F3';
      default:
        return grayColor;
    }
  };

  const getIconName = () => {
    switch (config.type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'info':
        return 'information-circle';
      default:
        return 'help-circle';
    }
  };

  // Support both formats: { message } and { text1, text2 }
  const messageText = config.message || config.text1 || '';
  const subtitleText = config.text2 || '';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.toast, getToastStyle()]}>
        <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
          <Icon name={getIconName()} size={20} color={whiteColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.message} numberOfLines={2}>
            {messageText}
          </Text>
          {subtitleText ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitleText}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => ToastManager.hide()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="close" size={18} color={whiteColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(8) : hp(6),
    left: wp(4),
    right: wp(4),
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingVertical: spacings.medium,
    paddingHorizontal: spacings.large,
    minHeight: hp(5.5),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  successToast: {
    backgroundColor: '#2C2C2E',
  },
  errorToast: {
    backgroundColor: '#2C2C2E',
  },
  infoToast: {
    backgroundColor: '#2C2C2E',
  },
  defaultToast: {
    backgroundColor: '#2C2C2E',
  },
  iconContainer: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacings.medium,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
    lineHeight: 20,
  },
  subtitle: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    opacity: 0.8,
    marginTop: spacings.xsmall,
  },
  closeButton: {
    padding: spacings.small,
    marginLeft: spacings.small,
    opacity: 0.7,
  },
});

// Export the Toast manager for use in other components
export const Toast = {
  show: (config) => ToastManager.show(config),
  hide: () => ToastManager.hide(),
};

export default CustomToast;
