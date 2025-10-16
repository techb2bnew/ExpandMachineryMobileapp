import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { whiteColor, lightBlack } from '../constans/Color';
import { style } from '../constans/Fonts';

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
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const listener = {
      onShow: (newConfig) => {
        setConfig(newConfig);
        setVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Auto hide after visibility time
        if (newConfig.visibilityTime) {
          setTimeout(() => {
            ToastManager.hide();
          }, newConfig.visibilityTime);
        }
      },
      onHide: () => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
        });
      },
    };

    ToastManager.addListener(listener);

    return () => {
      ToastManager.removeListener(listener);
    };
  }, [fadeAnim]);

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
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'info':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.toast, getToastStyle()]}>
        <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
          <Text style={styles.icon}>
            {config.type === 'success' ? '✓' : config.type === 'error' ? '✕' : 'ℹ'}
          </Text>
        </View>
        <View style={styles.textContainer}>
          {config.text1 && <Text style={styles.title}>{config.text1}</Text>}
          {config.text2 && <Text style={styles.message}>{config.text2}</Text>}
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => ToastManager.hide()}
        >
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightBlack,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  errorToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  infoToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  defaultToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#757575',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    color: whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...style.fontSizeNormal,
    color: whiteColor,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    ...style.fontSizeSmall2x,
    color: whiteColor,
    opacity: 0.9,
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    color: whiteColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

// Export the Toast manager for use in other components
export const Toast = {
  show: (config) => ToastManager.show(config),
  hide: () => ToastManager.hide(),
};

export default CustomToast;
