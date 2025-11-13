import React, { useEffect, useState } from 'react';
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
  ActivityIndicator,
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
  fetchWithAuth,
} from '../utils';
import { BaseStyle } from '../constans/Style';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constans/Constants';

const {
  flex,
  alignJustifyCenter,
  flexDirectionRow,
  alignItemsCenter,
  justifyContentSpaceBetween,
} = BaseStyle;

const SelectEquipmentScreen = ({ navigation, route }) => {
  const { supportType, categoryId } = route.params;
  // React.useEffect(() => {
  //   navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
  //   return () => navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
  // }, [navigation]);
  const [searchText, setSearchText] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [equipmentModels, setEquipmentModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoading(true);
      try {
        // Using fetchWithAuth - automatically handles token and auth errors
        const response = await fetchWithAuth(
          `${API_ENDPOINTS.BASE_URL}/api/app/equipment`,
          {
            method: 'GET',
          }
        );

        const result = await response.json();

        if (response.ok && Array.isArray(result?.data)) {
          console.log('result.data', result.data);
          setEquipmentModels(result.data);
        } else {
          const message = result?.message || 'Unable to load equipment list';
          console.log("Equipment Fetch Response Error:", message);
        }
      } catch (error) {
        console.error('Equipment Fetch Error:', error);

      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, []);
  const getEquipmentLabel = equipment => {
    if (!equipment) {
      return '';
    }

    const name = equipment?.name?.trim?.() || '';
    const serial = equipment?.serialNumber?.trim?.();

    if (name && serial) {
      return `${name} (${serial})`;
    }

    return name || serial || '';
  };

  const filteredModels = equipmentModels.filter(model => {
    const searchLower = searchText.toLowerCase();
    return [model?.name, model?.serialNumber, getEquipmentLabel(model)]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(searchLower));
  });

  const handleModelSelect = equipment => {
    setSelectedEquipment(equipment);
    setSerialNumber(equipment?.serialNumber?.trim?.() || '');
    setShowDropdown(false);
    setSearchText('');
  };

  const handleContinue = () => {
    if (selectedEquipment && serialNumber.trim()) {
      navigation.navigate('IssueDescription', {
        supportType,
        categoryId,
        equipmentId: selectedEquipment?.id,
        equipmentData: {
          model: selectedEquipment?.name,
          serial: serialNumber.trim(),
        },
      });
    }
  };

  const renderModelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleModelSelect(item)}
    >
      <Text style={styles.modelText}>{getEquipmentLabel(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'height' : undefined}
    >
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: lightColor }}>
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
                <View style={styles.modelSelectorContent}>
                  <Text
                    style={[
                      styles.modelSelectorText,
                      selectedEquipment
                        ? { color: whiteColor }
                        : { color: lightGrayColor },
                    ]}
                  >
                    {selectedEquipment
                      ? getEquipmentLabel(selectedEquipment)
                      : 'Choose your equipment model'}
                  </Text>
                </View>
                <Icon
                  name={showDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={lightGrayColor}
                />
              </TouchableOpacity>

              {/* Dropdown Modal */}
              <Modal
                visible={showDropdown}
                transparent={true}
                statusBarTranslucent={true}
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.dropdownContainer}>
                    <View style={styles.dropdownHeader}>
                      <View style={styles.dropdownHeaderSpacer} />
                      <Text style={styles.dropdownTitle}>
                        Choose your equipment
                      </Text>
                      <TouchableOpacity
                        style={styles.dropdownCloseButton}
                        onPress={() => setShowDropdown(false)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Icon name="close" size={20} color={whiteColor} />
                      </TouchableOpacity>
                    </View>
                    {isLoading ? (
                      <View style={styles.loaderContainer}>
                        <ActivityIndicator size="small" color={whiteColor} />
                      </View>
                    ) : (
                      <FlatList
                        data={filteredModels}
                        renderItem={renderModelItem}
                        keyExtractor={(item, index) =>
                          item?.id || item?.serialNumber || item?.name || String(index)
                        }
                        showsVerticalScrollIndicator={false}
                        style={styles.dropdownList}
                        ListEmptyComponent={
                          <Text style={styles.emptyStateText}>
                            No equipment found
                          </Text>
                        }
                      />
                    )}
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
            {selectedEquipment && serialNumber && (
              <View
                style={[
                  styles.selectedCard,
                  { borderWidth: 0.2, borderColor: greenColor },
                ]}
              >
                <Text style={[styles.selectedTitle, { color: greenColor }]}>
                  Selected Equipment
                </Text>
                <Text style={styles.selectedModel}>
                  {getEquipmentLabel(selectedEquipment)}
                </Text>
                <Text style={styles.selectedSerial}>
                  Serial: {serialNumber}
                </Text>
              </View>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                (!selectedEquipment || !serialNumber.trim()) &&
                styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!selectedEquipment || !serialNumber.trim()}
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
  modelSelectorContent: {
    flex: 1,
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
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacings.large,
    paddingTop: spacings.large,
    paddingBottom: spacings.small,
  },
  dropdownTitle: {
    flex: 1,
    ...style.fontSizeMedium,
    ...style.fontWeightThin,
    color: whiteColor,
    textAlign: 'center',
  },
  dropdownCloseButton: {
    padding: spacings.xsmall,
  },
  dropdownHeaderSpacer: {
    width: 32,
    height: 32,
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
  loaderContainer: {
    paddingVertical: spacings.xxLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
    textAlign: 'center',
    paddingVertical: spacings.large,
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