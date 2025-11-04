import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  darkgrayColor,
  whiteColor,
  lightGrayColor,
  grayColor,
  lightBlack,
  lightColor,
  lightPinkAccent,
  supportGreen,
  greenColor,
} from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../utils';
import { BaseStyle } from '../constans/Style';
import { SafeAreaView } from 'react-native-safe-area-context';

const {
  flex,
  alignJustifyCenter,
  flexDirectionRow,
  alignItemsCenter,
  justifyContentSpaceBetween,
} = BaseStyle;

const RequestSubmittedScreen = ({ navigation, route }) => {
  const {
    supportType,
    equipmentData,
    description,
    attachments, // Changed from attachedImages
    attachedImages, // Keep for backward compatibility
    ticketNumber,
    ticketData, // Ticket data from API response
  } = route.params;

  // Use attachments if available, otherwise fall back to attachedImages
  const displayAttachments = attachments || attachedImages || [];

  const handleStartChat = () => {
    console.log('Start chat for ticket:', ticketNumber);
    navigation.navigate('SupportChat', {
      ticketNumber,
      supportType,
      equipmentData,
      description,
      attachedImages: displayAttachments,
    });
  };

  const handleSubmitAnother = () => {
    navigation.navigate('HomeMain');
  };

  const autoNavigateTimerRef = useRef(null);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    // Auto navigate to Home after 10 seconds
    autoNavigateTimerRef.current = setTimeout(() => {
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        handleSubmitAnother();
      }
    }, 10000); // 10 seconds

    // Cleanup timer on unmount
    return () => {
      if (autoNavigateTimerRef.current) {
        clearTimeout(autoNavigateTimerRef.current);
      }
    };
  }, []);
  
  // Override handleSubmitAnother to mark as navigated
  const handleSubmitAnotherWithMark = () => {
    if (autoNavigateTimerRef.current) {
      clearTimeout(autoNavigateTimerRef.current);
    }
    hasNavigatedRef.current = true;
    handleSubmitAnother();
  };

  const handleCallSupport = () => {
    const phoneNumber = '1-800-EXPAND-1';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Request Submitted</Text>
          <Text style={styles.headerSubtitle}>We'll be in touch soon</Text>
        </View>
        {/* Success Icon */}
        <View style={[styles.successIcon, alignJustifyCenter]}>
          <Icon name="checkmark-circle-outline" size={40} color={greenColor} />
        </View>
        {/* Support Request Confirmation Card */}
        <View style={styles.confirmationCard}>
          <Text style={styles.successMessage}>
            Support Request Submitted Successfully!
          </Text>
          <Text style={styles.ticketLabel}>Your support ticket number is:</Text>

          <View style={[styles.ticketNumberContainer, alignJustifyCenter]}>
            <Text style={styles.ticketNumber}>{ticketNumber}</Text>
          </View>

          <Text style={styles.saveInstruction}>
            Please save this number for your records
          </Text>
        </View>

        {/* Start Chat Button */}
        {/* <TouchableOpacity
          style={[styles.chatButton, flexDirectionRow, alignItemsCenter]}
          onPress={handleStartChat}
        >
          <Icon name="chatbubble-outline" size={20} color={whiteColor} />
          <Text style={styles.chatButtonText}>Start Chat for this Ticket</Text>
        </TouchableOpacity> */}

        {/* Ticket Details Card */}
        <View style={styles.detailsCard}>
          <View style={[styles.cardHeader, flexDirectionRow, alignItemsCenter]}>
            <Icon name="time-outline" size={20} color={whiteColor} />
            <Text style={styles.cardTitle}>Ticket Details</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={[flexDirectionRow, alignItemsCenter]}>
              <Icon name="person-outline" size={16} color={whiteColor} />
              <View style={{ paddingHorizontal: spacings.large }}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{supportType}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[flexDirectionRow, alignItemsCenter]}>
              <Icon name="chatbubble-outline" size={16} color={whiteColor} />
              <View style={{ paddingHorizontal: spacings.large }}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{description}</Text>
              </View>
            </View>
          </View>

          {displayAttachments?.length > 0 && (
            <View style={styles.detailRow}>
              <View style={[flexDirectionRow, alignItemsCenter]}>
                <Icon name="camera-outline" size={16} color={whiteColor} />
                <View style={{ paddingHorizontal: spacings.large, flex: 1 }}>
                  <Text style={styles.detailLabel}>Attachments</Text>
                  <Text style={styles.detailValue}>
                    {displayAttachments?.length} file
                    {displayAttachments?.length !== 1 ? 's' : ''} attached
                  </Text>
                </View>
              </View>
            </View>
          )}
          {displayAttachments?.length > 0 && (
            <View style={styles.imagesContainer}>
              {displayAttachments?.map((attachment, index) => {
                // Check if it's an image
                const isImage = attachment?.type?.startsWith('image/') ||
                  attachment?.uri?.match(/\.(jpg|jpeg|png|gif|bmp)$/i);

                if (isImage) {
                  return (
                    <View key={attachment?.id || index} style={styles.imageWrapper}>
                      <Image
                        source={{ uri: attachment?.uri }}
                        style={styles.imagePreview}
                      />
                    </View>
                  );
                } else {
                  // Show document icon for non-image files
                  return (
                    <View key={attachment?.id || index} style={styles.fileWrapper}>
                      <Icon name="document-text-outline" size={32} color={whiteColor} />
                      <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                        {attachment?.name || 'Document'}
                      </Text>
                    </View>
                  );
                }
              })}
            </View>
          )}

          {equipmentData && (
            <View style={styles.detailRow}>
              <View style={[flexDirectionRow, alignItemsCenter]}>
                <Icon name="settings-outline" size={16} color={whiteColor} />
                <View style={{ paddingHorizontal: spacings.large }}>
                  <Text style={styles.detailLabel}>Equipment</Text>
                  <Text style={styles.detailValue}>{equipmentData?.model}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* What Happens Next Card */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.cardTitle}>What happens next?</Text>

          <View style={styles.stepItem}>
            <View style={[styles.stepBullet, alignJustifyCenter]}>
              <View style={styles.bulletDot} />
            </View>
            <Text style={styles.stepText}>
              Our support team will review your request
            </Text>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepBullet, alignJustifyCenter]}>
              <View style={styles.bulletDot} />
            </View>
            <Text style={styles.stepText}>
              We'll contact you using the information you provided
            </Text>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepBullet, alignJustifyCenter]}>
              <View style={styles.bulletDot} />
            </View>
            <Text style={styles.stepText}>
              You can track your request in the History tab
            </Text>
          </View>

          <View style={styles.responseTimeContainer}>
            <Text style={styles.responseTimeLabel}>Response Time:</Text>
            <Text style={styles.responseTimeText}>
              We typically respond within 1-2 business hours during regular
              business hours.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.submitAnotherButton,
              flexDirectionRow,
              alignItemsCenter,
            ]}
            onPress={handleSubmitAnotherWithMark}
          >
            <Icon name="refresh-outline" size={20} color={whiteColor} />
            <Text style={styles.submitAnotherText}>Submit Another Request</Text>
          </TouchableOpacity>

          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>
              Need immediate assistance? Call our support line at
            </Text>
            <TouchableOpacity onPress={handleCallSupport}>
              <Text style={styles.phoneNumber}>1-800-EXPAND-1</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColor,
  },
  header: {
    marginBottom: spacings.large,
    borderBottomWidth: 1,
    borderColor: grayColor,
    padding: spacings.large,
  },
  headerTitle: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
  },
  headerSubtitle: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: lightGrayColor,
    marginBottom: spacings.xxLarge,
  },
  successIcon: {
    width: wp(20),
    height: hp(10),
    borderRadius: 50,
    backgroundColor: supportGreen + 40,
    marginBottom: spacings.xxLarge,
    alignSelf: 'center',
  },
  confirmationCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxLarge,
    marginHorizontal: spacings.large,
    marginBottom: spacings.large,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successMessage: {
    ...style.fontSizeNormal2x,
    ...style.fontWeightThin1x,
    color: greenColor,
    textAlign: 'center',
    marginBottom: spacings.large,
  },
  ticketLabel: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    textAlign: 'center',
    marginBottom: spacings.medium,
  },
  ticketNumberContainer: {
    backgroundColor: lightColor,
    borderRadius: 8,
    width: wp(60),
    paddingHorizontal: spacings.xxxxLarge,
    paddingVertical: spacings.medium,
    marginBottom: spacings.medium,
    borderWidth: 0.5,
    borderColor: greenColor,
  },
  ticketNumber: {
    ...style.fontSizeNormal,
    color: whiteColor,
  },
  saveInstruction: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
    textAlign: 'center',
  },
  chatButton: {
    backgroundColor: lightBlack,
    borderRadius: 8,
    padding: spacings.large,
    marginHorizontal: spacings.large,
    marginBottom: spacings.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
    marginLeft: spacings.small,
  },
  detailsCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxLarge,
    marginHorizontal: spacings.large,
    marginBottom: spacings.large,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: spacings.large,
  },
  cardTitle: {
    ...style.fontSizeMedium,
    ...style.fontWeightThin,
    color: whiteColor,
    marginLeft: spacings.small,
  },
  detailRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'flex-start',
    marginBottom: spacings.medium,
  },
  detailLabel: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  detailValue: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  nextStepsCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxLarge,
    marginHorizontal: spacings.large,
    marginBottom: spacings.large,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacings.medium,
  },
  stepBullet: {
    width: 20,
    height: 20,
    marginRight: spacings.medium,
    marginTop: 2,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: supportGreen,
  },
  stepText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    flex: 1,
    lineHeight: 20,
  },
  responseTimeContainer: {
    marginTop: spacings.large,
    paddingTop: spacings.large,
    borderTopWidth: 1,
    borderTopColor: grayColor,
  },
  responseTimeLabel: {
    ...style.fontSizeNormal,
    ...style.fontWeightBold,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  responseTimeText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    lineHeight: 20,
  },
  actionButtons: {
    padding: spacings.large,
    alignItems: 'center',
  },
  submitAnotherButton: {
    backgroundColor: lightBlack,
    borderRadius: 8,
    padding: spacings.large,
    marginBottom: spacings.xxLarge,
    alignItems: 'center',
  },
  submitAnotherText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
    marginLeft: spacings.small,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    textAlign: 'center',
    marginBottom: spacings.small,
  },
  phoneNumber: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacings.medium, // agar React Native version support karta hai
    marginTop: spacings.medium,
  },
  imageWrapper: {
    marginBottom: spacings.medium,
  },
  imagePreview: {
    width: wp(20.5),
    height: wp(20),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightGrayColor,
  },
  fileWrapper: {
    width: wp(20.5),
    height: wp(20),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightGrayColor,
    backgroundColor: lightBlack,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacings.small,
  },
  fileName: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    marginTop: spacings.xsmall,
    textAlign: 'center',
  },
});

export default RequestSubmittedScreen;
