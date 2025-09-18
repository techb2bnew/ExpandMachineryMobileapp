import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { darkgrayColor, whiteColor, lightGrayColor, grayColor, lightBlack, lightColor, lightPinkAccent } from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { BaseStyle } from '../constans/Style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween } = BaseStyle;

const IssueDescriptionScreen = ({ navigation, route }) => {
  const { supportType, equipmentData } = route.params;

  const [description, setDescription] = useState('');
  const [attachedImages, setAttachedImages] = useState([]);



  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        return (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  };

  const handleAddPhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Please allow camera and storage permissions.');
      return;
    }
    if (attachedImages.length >= 5) {
      Alert.alert('Limit reached', 'You can attach up to 5 images only.');
      return;
    }

    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => pickImage('camera'),
        },
        {
          text: 'Gallery',
          onPress: () => pickImage('gallery'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = (type) => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };

    const callback = (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }

      const asset = response.assets[0];
      setAttachedImages((prev) => [...prev, { id: Date.now(), uri: asset.uri }]);
    };

    if (type === 'camera') launchCamera(options, callback);
    else launchImageLibrary(options, callback);
  };
  const handleRemovePhoto = (id) => {
    setAttachedImages((prev) => prev.filter(img => img.id !== id));
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please provide a description of your issue.');
      return;
    }

    // Generate ticket number
    const ticketNumber = 'EXP' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

    navigation.navigate('RequestSubmitted', {
      supportType,
      equipmentData,
      description: description.trim(),
      attachedImages,
      ticketNumber
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: lightColor }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={[styles.header, flexDirectionRow, alignItemsCenter]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={whiteColor} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{supportType}</Text>
            </View>
          </View>

          <View style={{ padding: spacings.xLarge, }}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>What can we help you with?</Text>

              <TextInput
                style={styles.descriptionInput}
                placeholder="Describe your programming question or issue. 
                 Include any error messages, software versions, or specific operations you're trying to perform..."
                placeholderTextColor={lightGrayColor}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={6}
              />

              <Text style={styles.helpText}>
                Please provide as much detail as possible to help us assist you better.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Would you like to attach any pictures?</Text>

              <Text style={styles.helpText}>
                Photos can help us understand your situation better. You can attach up to 5 images.
              </Text>




              {attachedImages.length === 0 ? (
                // Jab koi image nahi h tab sirf placeholder
                <TouchableOpacity
                  style={styles.addPhotoBox}
                  onPress={handleAddPhoto}
                  disabled={attachedImages.length >= 5}
                >
                  <Icon name="camera" size={28} color={lightGrayColor} />
                  <Text style={styles.addPhotoText}>Tap to add photos</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.imageContainer}>
                  {/* Images */}
                  {attachedImages.map((img) => (
                    <View key={img.id} style={styles.imageWrapper}>
                      <Image source={{ uri: img.uri }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.deleteIcon}
                        onPress={() => handleRemovePhoto(img.id)}
                      >
                        <Icon name="close-circle" size={22} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Placeholder sirf tab dikhana jab < 5 images */}
                  {attachedImages.length < 5 && (
                    <TouchableOpacity
                      style={styles.imagePreview}
                      onPress={handleAddPhoto}
                    >
                      <Icon name="camera" size={28} color={lightGrayColor} />
                      <Text style={styles.addPhotoText}>Tap to add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !description.trim() && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!description.trim()}
            >
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColor,
  },
  scrollView: {
    flex: 1,

  },
  header: {
    marginBottom: spacings.large,
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: grayColor,
    padding: spacings.large
  },
  backButton: {
    padding: spacings.small,
    marginRight: spacings.medium,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
  },
  card: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxLarge,
    marginBottom: spacings.large,
  },
  sectionTitle: {
    ...style.fontSizeMedium,
    ...style.fontWeightBold,
    color: whiteColor,
    marginBottom: spacings.medium,
  },
  descriptionInput: {
    // backgroundColor: darkgrayColor,
    borderRadius: 8,
    padding: spacings.large,
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    minHeight: hp(15),
    marginBottom: spacings.medium,
    textAlignVertical: 'top',
    borderWidth: .5,
    borderColor: grayColor
  },
  helpText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
  },
  addPhotoBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: lightGrayColor,
    borderRadius: 12,
    padding: spacings.xxLarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacings.large,
  },
  addPhotoText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: lightGrayColor,
    marginTop: spacings.small,
  },
  submitButton: {
    backgroundColor: lightBlack,
    borderRadius: 8,
    padding: spacings.xLarge,
    alignItems: 'center',
    marginTop: spacings.large,
    marginBottom: spacings.xxLarge,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacings.medium,
    marginTop: spacings.medium,
  },

  imageWrapper: {
    position: 'relative',
  },

  imagePreview: {
    width: wp(27),
    height: wp(27),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightGrayColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: whiteColor,
    borderRadius: 12,
  },

  addPhotoText: {
    ...style.fontSizeSmall1x,
    color: lightGrayColor,
    marginTop: 4,
  },

});

export default IssueDescriptionScreen;

