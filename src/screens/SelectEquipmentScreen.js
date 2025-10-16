import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
  redColor,
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

const SelectEquipmentScreen = ({ navigation, route }) => {
  const { supportType } = route.params || {
    supportType: 'Applications Support',
  };
// React.useEffect(() => {
//   navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
//   return () => navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
// }, [navigation]);
  const [searchText, setSearchText] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [equipmentData, setEquipmentData] = useState({
    model: '',
    serial: '',
  });

  const equipmentModels = [
    'Swiss Machine SM-200',
    'Swiss Machine SM-300',
    'Swiss Machine SM-400',
    'Turning Center TC-100',
  ];

  const filteredModels = equipmentModels.filter(model =>
    model.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleModelSelect = model => {
    setSelectedModel(model);
    setEquipmentData(prev => ({ ...prev, model }));
    setShowDropdown(false);
    setSearchText('');
  };

  const handleContinue = () => {
    if (selectedModel && serialNumber.trim()) {
      navigation.navigate('IssueDescription', {
        supportType,
        equipmentData: {
          model: selectedModel,
          serial: serialNumber,
        },
      });
    }
  };

  const renderModelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleModelSelect(item)}
    >
      <Text style={styles.modelText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
     behavior={Platform.OS === 'ios' ? 'height' : undefined}
    >
      <SafeAreaView  edges={['top']} style={{ flex: 1, backgroundColor: lightColor }}>
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
              <Text style={styles.headerTitle}>Select Equipment</Text>
              <Text style={styles.headerSubtitle}>{supportType}</Text>
            </View>
          </View>

          <View style={{ padding: spacings.large }}>
            {/* Equipment Model Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Equipment Model<Text style={{ color: redColor }}> *</Text>
              </Text>

              {/* Search Input */}
              <View
                style={[
                  styles.searchContainer,
                  flexDirectionRow,
                  alignItemsCenter,
                ]}
              >
                <Icon name="search" size={20} color={lightGrayColor} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search equipment models..."
                  placeholderTextColor={lightGrayColor}
                  value={searchText}
                  onChangeText={setSearchText}
                  onFocus={() => setShowDropdown(true)}
                />
              </View>

              {/* Model Selection */}
              <TouchableOpacity
                style={[
                  styles.modelSelector,
                  flexDirectionRow,
                  alignItemsCenter,
                  justifyContentSpaceBetween,
                ]}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text
                  style={[
                    styles.modelSelectorText,
                    selectedModel
                      ? { color: whiteColor }
                      : { color: lightGrayColor },
                  ]}
                >
                  {selectedModel || 'Choose your equipment model'}
                </Text>
                <Icon
                  name={showDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={lightGrayColor}
                />
              </TouchableOpacity>

              {/* Dropdown Modal */}
              <Modal
                visible={showDropdown}
                transparent={true} // 👈 transparent true kar
                statusBarTranslucent={true} // 👈 Android ke liye important
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.dropdownContainer}>
                    <Text
                      style={[
                        {
                          color: whiteColor,
                          textAlign: 'center',
                          padding: spacings.large,
                          fontSize: style.fontSizeMedium.fontSize,
                          fontWeight: style.fontWeightThin.fontWeight,
                        },
                      ]}
                    >
                      Choose your equipment model
                    </Text>
                    <FlatList
                      data={filteredModels}
                      renderItem={renderModelItem}
                      keyExtractor={item => item}
                      showsVerticalScrollIndicator={false}
                      style={styles.dropdownList}
                    />
                  </View>
                </View>
              </Modal>
            </View>

            {/* Serial Number Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Serial Number<Text style={{ color: redColor }}> *</Text>
              </Text>

              <TextInput
                style={styles.serialInput}
                placeholder="Enter equipment serial number"
                placeholderTextColor={lightGrayColor}
                value={serialNumber}
                onChangeText={setSerialNumber}
              />

              <Text style={styles.helpText}>
                Find this on your equipment's nameplate or documentation
              </Text>
            </View>

            {/* Selected Equipment Card (only show when both are selected) */}
            {selectedModel && serialNumber && (
              <View
                style={[
                  styles.selectedCard,
                  { borderWidth: 0.2, borderColor: greenColor },
                ]}
              >
                <Text style={[styles.selectedTitle, { color: greenColor }]}>
                  Selected Equipment
                </Text>
                <Text style={styles.selectedModel}>{selectedModel}</Text>
                <Text style={styles.selectedSerial}>
                  Serial: {serialNumber}
                </Text>
              </View>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                (!selectedModel || !serialNumber.trim()) &&
                  styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!selectedModel || !serialNumber.trim()}
            >
              <Text style={styles.continueButtonText}>
                Continue to Issue Description
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColor,
  },
  scrollView: {
    // flex: 1,
    flex: 1,
    backgroundColor: lightColor,
    // padding: spacings.large,
  },
  header: {
    marginBottom: spacings.large,
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: grayColor,
    padding: spacings.large,
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
  headerSubtitle: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    marginTop: spacings.xxsmall,
  },
  card: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxLarge,
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
  cardTitle: {
    ...style.fontSizeMedium,
    ...style.fontWeightThin,
    color: whiteColor,
    marginBottom: spacings.large,
  },
  searchContainer: {
    borderRadius: 10,
    paddingHorizontal: spacings.medium,
    paddingVertical: Platform.OS === 'ios' ? spacings.medium : 0,
    marginBottom: spacings.medium,
    borderWidth: 1,
    borderColor: grayColor,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacings.small,
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  modelSelector: {
    backgroundColor: lightColor,
    borderRadius: 8,
    padding: spacings.large,
  },
  modelSelectorText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacings.xxLarge,
  },
  dropdownContainer: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    maxHeight: hp(40),
    width: wp(85),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownList: {
    maxHeight: hp(35),
  },
  modelItem: {
    padding: spacings.large,
    borderBottomWidth: 1,
    borderBottomColor: grayColor,
  },
  modelText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  serialInput: {
    backgroundColor: lightColor,
    borderRadius: 8,
    padding: spacings.large,
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  helpText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    marginTop: spacings.large,
  },
  selectedCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxLarge,
    marginBottom: spacings.large,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  selectedTitle: {
    ...style.fontSizeMedium,
    ...style.fontWeightThin1x,
    marginBottom: spacings.medium,
  },
  selectedModel: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
    marginBottom: spacings.xsmall,
  },
  selectedSerial: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  continueButton: {
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
  continueButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
});

export default SelectEquipmentScreen;
