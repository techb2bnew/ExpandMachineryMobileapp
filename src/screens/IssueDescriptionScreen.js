
// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {
//   darkgrayColor,
//   whiteColor,
//   lightGrayColor,
//   grayColor,
//   lightBlack,
//   lightColor,
// } from '../constans/Color';
// import { style, spacings } from '../constans/Fonts';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from '../utils';
// import { BaseStyle } from '../constans/Style';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import DocumentPicker from 'react-native-document-picker';

// const {
//   flex,
//   alignJustifyCenter,
//   flexDirectionRow,
//   alignItemsCenter,
//   justifyContentSpaceBetween,
// } = BaseStyle;

// const IssueDescriptionScreen = ({ navigation, route }) => {
//   const { supportType, equipmentData } = route.params || {};

//   const [description, setDescription] = useState('');
//   const [attachments, setAttachments] = useState([]);

//   const requestMediaPermissions = async () => {
//     if (Platform.OS !== 'android') return true;
//     try {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//       ]);
//       return (
//         granted['android.permission.CAMERA'] ===
//           PermissionsAndroid.RESULTS.GRANTED &&
//         granted['android.permission.READ_EXTERNAL_STORAGE'] ===
//           PermissionsAndroid.RESULTS.GRANTED
//       );
//     } catch (e) {
//       console.warn(e);
//       return false;
//     }
//   };

//   const limit5 = arr => (arr.length > 5 ? arr.slice(0, 5) : arr);

//   const getNameFromUri = uri => {
//     try {
//       const p = uri.split(/[\/\\]/).pop();
//       return p || undefined;
//     } catch {
//       return undefined;
//     }
//   };

//   const isImage = mime => mime && mime.startsWith('image/');

//   const handleAddAttachment = async () => {
//     const ok = await requestMediaPermissions();
//     if (!ok) {
//       Alert.alert(
//         'Permission Denied',
//         'Please allow camera and storage permissions.',
//       );
//       return;
//     }
//     if (attachments.length >= 5) {
//       Alert.alert('Limit reached', 'You can attach up to 5 files only.');
//       return;
//     }

//     Alert.alert(
//       'Add Attachment',
//       'Choose an option',
//       [
//         { text: 'Camera (Photo)', onPress: () => pickImage('camera') },
//         { text: 'Gallery (Image)', onPress: () => pickImage('gallery') },
//         { text: 'Document (PDF/DOC/etc.)', onPress: pickDocument },
//         { text: 'Cancel', style: 'cancel' },
//       ],
//       { cancelable: true },
//     );
//   };

//   const pickImage = source => {
//     const options = {
//       mediaType: 'photo',
//       maxWidth: 1200,
//       maxHeight: 1200,
//       quality: 0.85,
//       includeBase64: false,
//     };

//     const cb = response => {
//       if (response?.didCancel) return;
//       if (response?.errorCode) {
//         console.log('ImagePicker Error: ', response.errorMessage);
//         return;
//       }
//       const asset = response?.assets?.[0];
//       if (!asset?.uri) return;

//       const att = {
//         id: Date.now(),
//         uri: asset.uri,
//         name: asset.fileName || getNameFromUri(asset.uri) || 'image.jpg',
//         type: asset.type || 'image/jpeg',
//         size: asset.fileSize,
//         from: source, // 'camera' | 'gallery'
//       };
//       setAttachments(prev => limit5([...prev, att]));
//     };

//     if (source === 'camera') launchCamera(options, cb);
//     else launchImageLibrary(options, cb);
//   };

//   const pickDocument = async () => {
//     try {
//       const result = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//         allowMultiSelection: false,
//         copyTo: 'cachesDirectory',
//       });

//       const file = Array.isArray(result) ? result[0] : result;
//       const uri = file.fileCopyUri || file.uri;

//       const att = {
//         id: Date.now(),
//         uri,
//         name: file.name || getNameFromUri(uri) || 'file',
//         type: file.type, // application/pdf, application/msword, etc.
//         size: file.size,
//         from: 'document',
//       };
//       setAttachments(prev => limit5([...prev, att]));
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) return;
//       console.log('DocumentPicker Error:', err);
//     }
//   };

//   const handleRemoveAttachment = id => {
//     setAttachments(prev => prev.filter(a => a.id !== id));
//   };

//   const handleSubmit = () => {
//     if (!description.trim()) {
//       Alert.alert(
//         'Required Field',
//         'Please provide a description of your issue.',
//       );
//       return;
//     }

//     const ticketNumber =
//       'EXP' +
//       Math.floor(Math.random() * 100000000)
//         .toString()
//         .padStart(8, '0');

//     navigation.navigate('RequestSubmitted', {
//       supportType,
//       equipmentData,
//       description: description.trim(),
//       attachments,
//       ticketNumber,
//     });
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: lightColor }}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <ScrollView
//           style={styles.scrollView}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header */}
//           <View style={[styles.header, flexDirectionRow, alignItemsCenter]}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//             >
//               <Icon name="arrow-back" size={24} color={whiteColor} />
//             </TouchableOpacity>
//             <View style={styles.headerTitleContainer}>
//               <Text style={styles.headerTitle}>{supportType}</Text>
//             </View>
//           </View>

//           <View style={{ padding: spacings.xLarge }}>
//             <View style={styles.card}>
//               <Text style={styles.sectionTitle}>
//                 What can we help you with?
//               </Text>

//               <TextInput
//                 style={styles.descriptionInput}
//                 placeholder="Describe your programming question or issue. 
// Include any error messages, software versions, or specific operations you're trying to perform..."
//                 placeholderTextColor={lightGrayColor}
//                 value={description}
//                 onChangeText={setDescription}
//                 multiline
//                 numberOfLines={6}
//               />

//               <Text style={styles.helpText}>
//                 Please provide as much detail as possible to help us assist you
//                 better.
//               </Text>
//             </View>

//             <View style={styles.card}>
//               <Text style={styles.sectionTitle}>
//                 Attach files (images, PDFs, docs, etc.)
//               </Text>
//               <Text style={styles.helpText}>
//                 You can attach up to 5 files. Images will show a preview; other
//                 files show name.
//               </Text>

//               {attachments.length === 0 ? (
//                 <TouchableOpacity
//                   style={styles.addBox}
//                   onPress={handleAddAttachment}
//                   disabled={attachments.length >= 5}
//                 >
//                   <Icon name="attach" size={28} color={lightGrayColor} />
//                   <Text style={styles.addPhotoText}>Tap to add file</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <View style={styles.attachmentsWrap}>
//                   {attachments.map(att =>
//                     isImage(att.type) ? (
//                       <View key={att.id} style={styles.imageWrapper}>
//                         <Image
//                           source={{ uri: att.uri }}
//                           style={styles.imagePreview}
//                         />
//                         <TouchableOpacity
//                           style={styles.deleteIcon}
//                           onPress={() => handleRemoveAttachment(att.id)}
//                         >
//                           <Icon name="close-circle" size={22} color="red" />
//                         </TouchableOpacity>
//                       </View>
//                     ) : (
//                       <View key={att.id} style={styles.fileChip}>
//                         <Icon
//                           name="document-text-outline"
//                           size={18}
//                           color={whiteColor}
//                         />
//                         <Text
//                           style={styles.fileName}
//                           numberOfLines={1}
//                           ellipsizeMode="middle"
//                         >
//                           {att.name}
//                         </Text>
//                         <TouchableOpacity
//                           onPress={() => handleRemoveAttachment(att.id)}
//                         >
//                           <Icon name="close" size={18} color={lightGrayColor} />
//                         </TouchableOpacity>
//                       </View>
//                     ),
//                   )}

//                   {attachments.length < 5 && (
//                     <TouchableOpacity
//                       style={styles.addTile}
//                       onPress={handleAddAttachment}
//                     >
//                       <Icon name="add" size={28} color={lightGrayColor} />
//                       <Text style={styles.addPhotoText}>Add</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               )}
//             </View>

//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 !description.trim() && styles.disabledButton,
//               ]}
//               onPress={handleSubmit}
//               disabled={!description.trim()}
//             >
//               <Text style={styles.submitButtonText}>Submit Request</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: lightColor },
//   scrollView: { flex: 1 },
//   header: {
//     marginBottom: spacings.large,
//     borderBottomWidth: 1,
//     borderColor: grayColor,
//     padding: spacings.large,
//   },
//   backButton: { padding: spacings.small, marginRight: spacings.medium },
//   headerTitleContainer: { flex: 1 },
//   headerTitle: {
//     fontSize: style.fontSizeLarge.fontSize,
//     fontWeight: style.fontWeightThin1x.fontWeight,
//     color: whiteColor,
//   },
//   card: {
//     backgroundColor: lightBlack,
//     borderRadius: 12,
//     padding: spacings.xxLarge,
//     marginBottom: spacings.large,
//   },
//   sectionTitle: {
//     ...style.fontSizeMedium,
//     ...style.fontWeightBold,
//     color: whiteColor,
//     marginBottom: spacings.medium,
//   },
//   descriptionInput: {
//     borderRadius: 8,
//     padding: spacings.large,
//     ...style.fontSizeNormal,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     minHeight: hp(15),
//     marginBottom: spacings.medium,
//     textAlignVertical: 'top',
//     borderWidth: 0.5,
//     borderColor: grayColor,
//   },
//   helpText: {
//     ...style.fontSizeSmall1x,
//     ...style.fontWeightThin,
//     color: lightGrayColor,
//   },

//   addBox: {
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: lightGrayColor,
//     borderRadius: 12,
//     padding: spacings.xxLarge,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: spacings.large,
//   },
//   addPhotoText: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightThin,
//     color: lightGrayColor,
//     marginTop: spacings.small,
//   },

//   attachmentsWrap: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacings.medium,
//     marginTop: spacings.medium,
//   },

//   imageWrapper: { position: 'relative' },
//   imagePreview: {
//     width: wp(27),
//     height: wp(27),
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: lightGrayColor,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   deleteIcon: {
//     position: 'absolute',
//     top: -6,
//     right: -6,
//     backgroundColor: whiteColor,
//     borderRadius: 12,
//   },

//   addTile: {
//     width: wp(27),
//     height: wp(27),
//     borderRadius: 8,
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: lightGrayColor,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   fileChip: {
//     maxWidth: wp(60),
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     borderWidth: 1,
//     borderColor: lightGrayColor,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//   },
//   fileName: {
//     flexShrink: 1,
//     ...style.fontSizeSmall1x,
//     color: whiteColor,
//   },

//   submitButton: {
//     backgroundColor: lightBlack,
//     borderRadius: 8,
//     padding: spacings.xLarge,
//     alignItems: 'center',
//     marginTop: spacings.large,
//     marginBottom: spacings.xxLarge,
//   },
//   disabledButton: { opacity: 0.5 },
//   submitButtonText: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightMedium,
//     color: whiteColor,
//   },
// });

// export default IssueDescriptionScreen;


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
import {
  darkgrayColor,
  whiteColor,
  lightGrayColor,
  grayColor,
  lightBlack,
  lightColor,
} from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../utils';
import { BaseStyle } from '../constans/Style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// ⬇️ Updated import per your instructions
import { pick, keepLocalCopy } from '@react-native-documents/picker';

const {
  flex,
  alignJustifyCenter,
  flexDirectionRow,
  alignItemsCenter,
  justifyContentSpaceBetween,
} = BaseStyle;

const IssueDescriptionScreen = ({ navigation, route }) => {
  const { supportType, equipmentData } = route.params || {};

  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

  const requestMediaPermissions = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (e) {
      console.warn(e);
      return false;
    }
  };

  const limit5 = arr => (arr.length > 5 ? arr.slice(0, 5) : arr);

  const getNameFromUri = uri => {
    try {
      const p = uri.split(/[\/\\]/).pop();
      return p || undefined;
    } catch {
      return undefined;
    }
  };

  const isImage = mime => mime && mime.startsWith('image/');

  const handleAddAttachment = async () => {
    const ok = await requestMediaPermissions();
    if (!ok) {
      Alert.alert(
        'Permission Denied',
        'Please allow camera and storage permissions.',
      );
      return;
    }
    if (attachments.length >= 5) {
      Alert.alert('Limit reached', 'You can attach up to 5 files only.');
      return;
    }

    Alert.alert(
      'Add Attachment',
      'Choose an option',
      [
        { text: 'Camera (Photo)', onPress: () => pickImage('camera') },
        { text: 'Gallery (Image)', onPress: () => pickImage('gallery') },
        { text: 'Document (PDF/DOC/etc.)', onPress: pickDocument },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const pickImage = source => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.85,
      includeBase64: false,
    };

    const cb = response => {
      if (response?.didCancel) return;
      if (response?.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }
      const asset = response?.assets?.[0];
      if (!asset?.uri) return;

      const att = {
        id: Date.now(),
        uri: asset.uri,
        name: asset.fileName || getNameFromUri(asset.uri) || 'image.jpg',
        type: asset.type || 'image/jpeg',
        size: asset.fileSize,
        from: source, // 'camera' | 'gallery'
      };
      setAttachments(prev => limit5([...prev, att]));
    };

    if (source === 'camera') launchCamera(options, cb);
    else launchImageLibrary(options, cb);
  };

  // ⬇️ Updated to use pick + keepLocalCopy (no pickSingle / copyTo)
  const pickDocument = async () => {
    try {
      // Previously: const result = await DocumentPicker.pick({...})
      // Now:
      const [file] = await pick();

      if (!file?.uri) return;

      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: file.uri,
            fileName: file.name ?? 'fallbackName',
          },
        ],
        destination: 'documentDirectory',
      });

      const uri = localCopy?.uri ?? file.uri;

      const att = {
        id: Date.now(),
        uri,
        name: localCopy?.name ?? file.name ?? getNameFromUri(uri) ?? 'file',
        // Keep best-effort type mapping without changing other logic
        type: file.type || file.mimeType || 'application/octet-stream',
        size: file.size,
        from: 'document',
      };
      setAttachments(prev => limit5([...prev, att]));
    } catch (err) {
      // Silent return on user cancel; log others
      if (err && (err.code === 'USER_CANCELLED' || err.message?.toLowerCase?.().includes('cancel'))) {
        return;
      }
      console.log('DocumentPicker Error:', err);
    }
  };

  const handleRemoveAttachment = id => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert(
        'Required Field',
        'Please provide a description of your issue.',
      );
      return;
    }

    const ticketNumber =
      'EXP' +
      Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, '0');

    navigation.navigate('RequestSubmitted', {
      supportType,
      equipmentData,
      description: description.trim(),
      attachments,
      ticketNumber,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: lightColor }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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

          <View style={{ padding: spacings.xLarge }}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                What can we help you with?
              </Text>

              <TextInput
                style={styles.descriptionInput}
                placeholder="Describe your programming question or issue. 
Include any error messages, software versions, or specific operations you're trying to perform..."
                placeholderTextColor={lightGrayColor}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
              />

              <Text style={styles.helpText}>
                Please provide as much detail as possible to help us assist you
                better.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Attach files (images, PDFs, docs, etc.)
              </Text>
              <Text style={styles.helpText}>
                You can attach up to 5 files. Images will show a preview; other
                files show name.
              </Text>

              {attachments.length === 0 ? (
                <TouchableOpacity
                  style={styles.addBox}
                  onPress={handleAddAttachment}
                  disabled={attachments.length >= 5}
                >
                  <Icon name="attach" size={28} color={lightGrayColor} />
                  <Text style={styles.addPhotoText}>Tap to add file</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.attachmentsWrap}>
                  {attachments.map(att =>
                    isImage(att.type) ? (
                      <View key={att.id} style={styles.imageWrapper}>
                        <Image
                          source={{ uri: att.uri }}
                          style={styles.imagePreview}
                        />
                        <TouchableOpacity
                          style={styles.deleteIcon}
                          onPress={() => handleRemoveAttachment(att.id)}
                        >
                          <Icon name="close-circle" size={22} color="red" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View key={att.id} style={styles.fileChip}>
                        <Icon
                          name="document-text-outline"
                          size={18}
                          color={whiteColor}
                        />
                        <Text
                          style={styles.fileName}
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          {att.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveAttachment(att.id)}
                        >
                          <Icon name="close" size={18} color={lightGrayColor} />
                        </TouchableOpacity>
                      </View>
                    ),
                  )}

                  {attachments.length < 5 && (
                    <TouchableOpacity
                      style={styles.addTile}
                      onPress={handleAddAttachment}
                    >
                      <Icon name="add" size={28} color={lightGrayColor} />
                      <Text style={styles.addPhotoText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !description.trim() && styles.disabledButton,
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
  container: { flex: 1, backgroundColor: lightColor },
  scrollView: { flex: 1 },
  header: {
    marginBottom: spacings.large,
    borderBottomWidth: 1,
    borderColor: grayColor,
    padding: spacings.large,
  },
  backButton: { padding: spacings.small, marginRight: spacings.medium },
  headerTitleContainer: { flex: 1 },
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
    borderRadius: 8,
    padding: spacings.large,
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    minHeight: hp(15),
    marginBottom: spacings.medium,
    textAlignVertical: 'top',
    borderWidth: 0.5,
    borderColor: grayColor,
  },
  helpText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
  },

  addBox: {
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

  attachmentsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacings.medium,
    marginTop: spacings.medium,
  },

  imageWrapper: { position: 'relative' },
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

  addTile: {
    width: wp(27),
    height: wp(27),
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: lightGrayColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fileChip: {
    maxWidth: wp(60),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: lightGrayColor,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  fileName: {
    flexShrink: 1,
    ...style.fontSizeSmall1x,
    color: whiteColor,
  },

  submitButton: {
    backgroundColor: lightBlack,
    borderRadius: 8,
    padding: spacings.xLarge,
    alignItems: 'center',
    marginTop: spacings.large,
    marginBottom: spacings.xxLarge,
  },
  disabledButton: { opacity: 0.5 },
  submitButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
});

export default IssueDescriptionScreen;
