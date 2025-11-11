import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Image, StatusBar, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { darkgrayColor, whiteColor, supportBlue, supportGreen, supportPurple, supportGold, grayColor, lightColor, lightBlack } from '../constans/Color'
import { style, spacings } from '../constans/Fonts'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, fetchWithAuth } from '../utils';
import { INSIDE_COMPANY_LOGO } from '../assests/images'
import { BaseStyle } from '../constans/Style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { API_ENDPOINTS } from '../constans/Constants'
const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter } = BaseStyle;

// Mapping configuration for icons and colors based on category name
const categoryConfig = {
  'Applications Support': {
    icon: 'code-slash',
    iconColor: supportBlue,
    iconType: Ionicons,
    order: 1
  },
  'Service Support': {
    icon: 'tool',
    iconColor: supportGreen,
    iconType: Feather,
    order: 2
  },
  'Parts Support': {
    icon: 'cube-outline',
    iconColor: supportPurple,
    iconType: Ionicons,
    order: 3
  },
  'Sales Support': {
    icon: 'dollar-sign',
    iconColor: supportGold,
    iconType: Feather,
    order: 4
  },
}

const CustomerHome = ({ navigation }) => {
  const [supportCategories, setSupportCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)

      // Using fetchWithAuth - automatically handles token and auth errors
      const response = await fetchWithAuth(`${API_ENDPOINTS.BASE_URL}/api/app/categories`, {
        method: 'GET',
      })

      const data = await response.json()
      console.log('Categories API Response:', data)

      if (response.ok && data?.success && data?.data) {
        // Transform API data to match the structure
        const transformedCategories = data.data.map((category) => {
          const config = categoryConfig[category.name] || {
            icon: 'help-circle-outline',
            iconColor: grayColor,
            iconType: Ionicons,
            order: 999
          }

          return {
            id: category.id,
            title: category.name,
            description: category.description,
            icon: config.icon,
            iconColor: config.iconColor,
            iconType: config.iconType,
            order: config.order
          }
        })

        // Sort by order: Applications Support (1), Service Support (2), Parts Support (3), Sales Support (4)
        transformedCategories.sort((a, b) => a.order - b.order)

        setSupportCategories(transformedCategories)
      } else {
        console.log('Failed to fetch categories')
      }
    } catch (error) {
      console.log('Categories fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSupportPress = (category) => {
    console.log('Support category pressed:', category.title)
    // First 3 cards (Applications, Service, Parts) go to Select Equipment screen
    if (category.order <= 3) {
      navigation.navigate('SelectEquipment', {
        supportType: category.title,
        categoryId: category.id
      });
    } else {
      // 4th card (Sales Support) goes to Issue Description directly
      navigation.navigate('IssueDescription', {
        supportType: category.title,
        categoryId: category.id,
        equipmentData: null // No equipment needed for sales support
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>EXPAND Support</Text>
          <Text style={styles.subtitle}>How can we help you today?</Text>
        </View>
        <View style={{ height: hp(25) }}>
          <Image source={INSIDE_COMPANY_LOGO} style={{ width: "100%", height: "100%" }} />
        </View>

        <View style={styles.categoriesContainer}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: hp(10) }}>
              <ActivityIndicator size="large" color={whiteColor} />
            </View>
          ) : (
            <FlatList
              data={supportCategories}
              keyExtractor={(item) => item.id.toString()}
              horizontal={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryCard, flexDirectionRow, alignItemsCenter, { borderColor: item.iconColor + "90", borderWidth: 0.5}]}
                  onPress={() => handleSupportPress(item)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '13' }, alignJustifyCenter]}>
                    <item.iconType name={item.icon} size={24} color={item.iconColor} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                    <Text style={styles.categoryDescription}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CustomerHome

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(100),
    backgroundColor: lightColor,
  },
  header: {
    paddingHorizontal: spacings.xxLarge,
    paddingTop: spacings.xxLarge,
    paddingBottom: spacings.xxLarge,
    borderBottomColor: grayColor,
    borderBottomWidth: 1
  },
  title: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  subtitle: {
    fontSize: style.fontSizeNormal.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: whiteColor,
    opacity: 0.9,
  },
  categoriesContainer: {
    padding: spacings.large,
    paddingVertical: spacings.xxLarge,
    marginBottom: hp(10)
  },
  categoryCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxxLarge,
    marginBottom: spacings.medium,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: wp(14),
    height: hp(7),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacings.large,
  },
  textContainer: {
    flex: 1,
  },
  categoryTitle: {
    ...style.fontSizeMedium,
    color: whiteColor,
    marginBottom: spacings.xsmall,
  },
  categoryDescription: {
    ...style.fontSizeSmall2x,
    ...style.fontWeightThin,
    color: whiteColor,
    opacity: 0.8,
  },
})
