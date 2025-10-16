import { StyleSheet, Text, View, Image, Dimensions, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { APP_LOGO } from '../assests/images'
import { darkgrayColor, whiteColor, blueColor, goldColor, lightGrayColor, blackColor } from '../constans/Color'
import { style, spacings } from '../constans/Fonts'

const { width, height } = Dimensions.get('window')

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.5)).current
  const progressAnim = useRef(new Animated.Value(0)).current
  const textFadeAnim = useRef(new Animated.Value(1)).current
  const [loadingText, setLoadingText] = useState('Initializing...')

  useEffect(() => {
    // Logo fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()

    // Progress bar animation - smooth and continuous
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
      ])
    ).start()

    // Loading text changes with fade animation
    const textInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()

      setLoadingText(prev => {
        switch (prev) {
          case 'Initializing...':
            return 'Loading components...'
          case 'Loading components...':
            return 'Setting up interface...'
          case 'Setting up interface...':
            return 'Almost ready...'
          default:
            return 'Initializing...'
        }
      })
    }, 800)

    return () => clearInterval(textInterval)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image
            source={APP_LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.appName}>EXPAND</Text>
        <Text style={styles.tagline}>Customer Support</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]}
          />
        </View>
      </View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2F2F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacings.xxLarge,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacings.xxLarge,
  },
  logoWrapper: {
    width: width * 0.25,
    height: width * 0.25,
    backgroundColor: whiteColor,
    borderRadius: 10,
    justifyContent: 'center',
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
  logo: {
    width: '95%',
    height: '95%',
    borderRadius:10
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: style.fontSizeLarge1x.fontSize,
    fontWeight: style.fontWeightBold.fontWeight,
    color: whiteColor,
    textAlign: 'center',
    marginBottom: spacings.small,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: style.fontSizeMedium.fontSize,
    color: whiteColor,
    textAlign: 'center',
    opacity: 0.9,
  },
  progressContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '90%',
    padding: spacings.xxLarge,
  },
  progressBar: {
    width: '90%',
    height: 4,
    backgroundColor: lightGrayColor,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacings.medium,
  },
  progressFill: {
    height: '100%',
    backgroundColor: whiteColor,
    borderRadius: 2,
  },
  loadingText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    textAlign: 'center',
    opacity: 0.8,
  },
})