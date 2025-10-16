import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseStyle } from '../constans/Style';
import { style, spacings } from '../constans/Fonts';
import { lightBlack, lightColor, lightPinkAccent, whiteColor, supportGreen, supportBlue } from '../constans/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';

const { flex, flexDirectionRow, alignItemsCenter, alignJustifyCenter, justifyContentSpaceBetween } = BaseStyle;

const PrivacyPolicyScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('privacy');

  const Header = () => (
    <View style={[styles.header, flexDirectionRow, alignItemsCenter]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, alignJustifyCenter]}>
        <Ionicons name="chevron-back" size={22} color={whiteColor} />
      </TouchableOpacity>
      <View style={styles.headerTextWrap}>
        <Text style={styles.headerTitle}>Privacy Policy and Terms</Text>
        <Text style={styles.headerSubtitle}>Legal information and policies</Text>
      </View>
    </View>
  );

  const Tabs = () => (
    <View style={[styles.tabsWrap, flexDirectionRow]}>
      <TouchableOpacity
        style={[styles.tabBtn, activeTab === 'privacy' && styles.tabBtnActive]}
        onPress={() => setActiveTab('privacy')}
        activeOpacity={0.8}
      >
        <Ionicons name="shield-outline" size={16} color={whiteColor} />
        <Text style={styles.tabText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabBtn, activeTab === 'terms' && styles.tabBtnActive]}
        onPress={() => setActiveTab('terms')}
        activeOpacity={0.8}
      >
        <Ionicons name="document-text-outline" size={16} color={whiteColor} />
        <Text style={styles.tabText}>Terms & Conditions</Text>
      </TouchableOpacity>
    </View>
  );

  const Card = ({ title, children, rightAddon }) => (
    <View style={styles.card}>
      <View style={[flexDirectionRow, justifyContentSpaceBetween, alignItemsCenter, styles.cardHeader]}>
        <View style={[flexDirectionRow, alignItemsCenter]}>
          <Ionicons name={title.icon || 'shield-checkmark-outline'} size={18} color={title.color || whiteColor} />
          <Text style={styles.cardTitle}>{title.text}</Text>
        </View>
        {rightAddon}
      </View>
      {children}
    </View>
  );

  const BadgeDot = ({ color }) => (
    <View style={[styles.dot, { backgroundColor: color }]} />
  );

  const PrivacyBody = () => (
    <>
      <Text style={styles.updatedAt}>Last updated: August 29, 2025</Text>
      <Card title={{ text: 'Privacy Policy', icon: 'shield-outline', color: '#6E8CB8' }}>
        <Text style={styles.paragraph}>
          3D Cam is committed to protecting your privacy and ensuring the security of your personal information. This privacy policy explains how we collect, use, and protect your data when you use our customer support application.
        </Text>
      </Card>

      <Card title={{ text: 'Information We Collect', icon: 'information-circle-outline' }}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Name and contact information</Text></View>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Email address and phone number</Text></View>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Machine serial numbers and models</Text></View>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Support ticket information and correspondence</Text></View>

        <Text style={[styles.sectionTitle, { marginTop: spacings.large }]}>Technical Information</Text>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Device information and operating system</Text></View>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>App usage statistics and performance data</Text></View>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Error logs and diagnostic information</Text></View>
      </Card>

      <Card title={{ text: 'How We Use Your Information', icon: 'list-outline' }}>
        <View style={[styles.legendRow]}>
          <BadgeDot color={lightPinkAccent} /><Text style={styles.bulletText}>Provide customer support and technical assistance</Text>
        </View>
        <View style={styles.legendRow}>
          <BadgeDot color={'#2bd4bd'} /><Text style={styles.bulletText}>Improve our products and services</Text>
        </View>
        <View style={styles.legendRow}>
          <BadgeDot color={'#ff7a59'} /><Text style={styles.bulletText}>Send important updates and notifications</Text>
        </View>
        <View style={styles.legendRow}>
          <BadgeDot color={'#f5a142'} /><Text style={styles.bulletText}>Ensure security and prevent fraud</Text>
        </View>
      </Card>

      <Card title={{ text: 'Data Protection', icon: 'lock-closed-outline' }}>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures to protect your personal information, including encryption, secure data transmission, and access controls. Your data is stored securely and is only accessible to authorized personnel who need it to provide support services.
        </Text>
      </Card>

      <Card title={{ text: 'Your Rights', icon: 'checkmark-sharp' }}>
        <Text style={styles.paragraph}>You have the right to:</Text>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Access your personal data</Text></View>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Correct inaccurate information</Text></View>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Request deletion of your data</Text></View>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Withdraw consent at any time</Text></View>
        <View style={styles.bulletRow}><Text style={styles.bullet}>{'\u2022'}</Text><Text style={styles.bulletText}>Export your data in a portable format</Text></View>
      </Card>

      <HelpCard />
    </>
  );

  const TermsBody = () => (
    <>
      <Text style={styles.updatedAt}>Last updated: August 29, 2025</Text>
      <Card title={{ text: 'Terms and Conditions', icon: 'document-text-outline', color: '#0EE1A6' }}>
        <Text style={styles.paragraph}>
          By using the 3D Cam Customer Support application, you agree to be bound by these terms and conditions. Please read them carefully before using our services.
        </Text>
      </Card>

      <Card title={{ text: 'Service Description', icon: 'construct-outline' }}>
        <Text style={styles.paragraph}>
          Our customer support application provides technical assistance, troubleshooting, and maintenance support for 3D Cam machinery. Services include live chat support, ticket management, expert consultation, and access to technical documentation.
        </Text>
      </Card>

      <Card title={{ text: 'User Responsibilities', icon: 'people-outline' }}>
        <View style={styles.legendRow}><BadgeDot color={lightPinkAccent} /><Text style={styles.bulletText}>Provide accurate and complete information</Text></View>
        <View style={styles.legendRow}><BadgeDot color={'#2bd4bd'} /><Text style={styles.bulletText}>Use the service only for legitimate support needs</Text></View>
        <View style={styles.legendRow}><BadgeDot color={'#ff7a59'} /><Text style={styles.bulletText}>Maintain confidentiality of account credentials</Text></View>
        <View style={styles.legendRow}><BadgeDot color={'#f5a142'} /><Text style={styles.bulletText}>Follow safety guidelines and recommendations</Text></View>
      </Card>

      <Card title={{ text: 'Service Availability', icon: 'time-outline' }}>
        <View style={styles.supportPanel}>
          <Text style={styles.supportPanelTitle}>Support Hours</Text>
          <Text style={styles.paragraph}>Monday - Friday: 8:00 AM - 6:00 PM EST</Text>
          <Text style={styles.paragraph}>Emergency Support: 24/7</Text>
        </View>
      </Card>

      <Card title={{ text: 'Limitation of Liability', icon: 'alert-circle-outline' }}>
        <Text style={styles.paragraph}>
          3D Cam shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of this application. Our liability is limited to the amount paid for our services in the twelve months preceding any claim.
        </Text>
      </Card>

      <Card title={{ text: 'Modifications to Terms', icon: 'create-outline' }}>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or in-app notification. Continued use of the service after changes constitutes acceptance of the updated terms.
        </Text>
      </Card>

      <HelpCard />
    </>
  );

  const HelpCard = () => (
    <View style={styles.helpCard}>
      <View style={[flexDirectionRow, alignItemsCenter, { marginBottom: spacings.small }]}>
        <Ionicons name="people-outline" size={18} color={whiteColor} />
        <Text style={[styles.helpTitle, { marginLeft: spacings.small }]}>Questions or Concerns?</Text>
      </View>
      <Text style={styles.paragraph}>
        If you have any questions about our privacy policy or terms and conditions, please contact our support team.
      </Text>
      <View style={{ marginTop: spacings.normal }}>
        <TouchableOpacity style={styles.helpBtnOutline} activeOpacity={0.85}>
          <Ionicons name="calendar-outline" size={16} color={whiteColor} />
          <Text style={styles.helpBtnOutlineText}>Contact Support Team</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.helpBtnOutline, { marginTop: spacings.small }]} activeOpacity={0.85}>
          <Ionicons name="open-outline" size={16} color={whiteColor} />
          <Text style={styles.helpBtnOutlineText}>View Full Legal Documents</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: spacings.xLarge }} showsVerticalScrollIndicator={false}>
        <Header />
        <Tabs />
        {activeTab === 'privacy' ? <PrivacyBody /> : <TermsBody />}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: Platform.OS === 'ios' ? hp(92) : hp(90),
    backgroundColor: lightColor,
  },
  header: {
    marginBottom: spacings.large,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: lightBlack,
    marginRight: spacings.large,
  },
  headerTextWrap: {
  },
  headerTitle: {
    ...style.fontSizeLarge,
    ...style.fontWeightThin1x,
    color: whiteColor,
  },
  headerSubtitle: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    opacity: 0.8,
  },
  tabsWrap: {
    backgroundColor: lightBlack,
    borderRadius: 10,
    padding: spacings.xsmall,
    marginBottom: spacings.large,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacings.normalx,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: lightPinkAccent,
  },
  tabText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin1x,
    color: whiteColor,
    marginLeft: 6,
  },
  card: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    marginBottom: spacings.large,
    padding: spacings.large,
  },
  cardHeader: {
    marginBottom: spacings.normal,
  },
  cardTitle: {
    ...style.fontSizeNormal2x,
    ...style.fontWeightThin1x,
    color: whiteColor,
    marginLeft: spacings.small,
  },
  updatedAt: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    opacity: 0.8,
    marginBottom: spacings.large,
  },
  paragraph: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    lineHeight: 20,
  },
  sectionTitle: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin1x,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacings.xsmall,
  },
  bullet: {
    color: whiteColor,
    marginRight: spacings.small,
    marginTop: 1,
  },
  bulletText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.small,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacings.normal,
  },
  helpCard: {
    backgroundColor: '#103E63',
    borderRadius: 12,
    padding: spacings.large,
    marginTop: spacings.large,
    borderWidth: 1,
    borderColor: supportBlue,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    marginBottom: spacings.ExtraLarge,
  },
  helpTitle: {
    ...style.fontSizeNormal2x,
    ...style.fontWeightThin1x,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  helpBtn: {
    backgroundColor: lightPinkAccent,
    borderRadius: 8,
    paddingVertical: spacings.normal,
    paddingHorizontal: spacings.large,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacings.normal,
  },
  helpBtnText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin1x,
    color: whiteColor,
    marginLeft: spacings.small,
  },
  helpBtnOutline: {
    backgroundColor: '#202020',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: supportBlue,
    borderRadius: 8,
    paddingVertical: spacings.normal,
    paddingHorizontal: spacings.large,
  },
  helpBtnOutlineText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin1x,
    color: '#81ADED',
    marginLeft: spacings.small,
  },
  supportPanel: {
    borderWidth: 1,
    borderColor: '#07F8B5',
    borderRadius: 10,
    backgroundColor: '#2A4037',
    padding: spacings.large,
  },
  supportPanelTitle: {
    ...style.fontSizeNormal1x,
    ...style.fontWeightThin1x,
    color: '#07F8B5',
    marginBottom: spacings.small,
  },
  supportBadge: {
    borderColor: supportGreen,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: spacings.large,
  },
  supportBadgeText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin1x,
    color: whiteColor,
  },
});


