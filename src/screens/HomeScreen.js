import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import { darkgrayColor, whiteColor, supportBlue, supportGreen, supportPurple, supportGold, grayColor, lightColor, lightBlack } from '../constans/Color'
import { style, spacings } from '../constans/Fonts'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { INSIDE_COMPANY_LOGO } from '../assests/images'
import { BaseStyle } from '../constans/Style'
import { SafeAreaView } from 'react-native-safe-area-context'
const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter } = BaseStyle;


const HomeScreen = ({ navigation }) => {
  const supportCategories = [
    {
      id: 1,
      title: 'Applications Support',
      description: 'Programming related questions',
      icon: 'code-slash',
      iconColor: supportBlue,
      iconType: Ionicons
    },
    {
      id: 2,
      title: 'Service Support',
      description: 'Fixing your machine',
      icon: 'tool',
      iconColor: supportGreen,
      iconType: Feather
    },
    {
      id: 3,
      title: 'Parts Support',
      description: 'Pricing for Spare Parts',
      icon: 'cube-outline',
      iconColor: supportPurple,
      iconType: Ionicons
    },
    {
      id: 4,
      title: 'Sales Support',
      description: 'Pricing on options or a new machine',
      icon: 'dollar-sign',
      iconColor: supportGold,
      iconType: Feather
    },
  ]

  const handleSupportPress = (category) => {
    console.log('Support category pressed:', category.title)
    // First 3 cards go to Select Equipment screen
    // if (category.id <= 3) {
    //   navigation.navigate('SelectEquipment', {
    //     supportType: category.title
    //   });
    // } else {
    //   // 4th card (Sales Support) goes to Issue Description directly
    //   navigation.navigate('IssueDescription', {
    //     supportType: category.title,
    //     equipmentData: null // No equipment needed for sales support
    //   });
    // }
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
          <FlatList
            data={supportCategories}
            keyExtractor={(item) => item.id.toString()}
            horizontal={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryCard, flexDirectionRow, alignItemsCenter]}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

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
    paddingVertical: spacings.xxLarge
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


// import { Button, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import AsyncStorage from '@react-native-async-storage/async-storage';


// const HomeScreen = () => {
//   const handleLogout = async (navigation) => {
//     try {
//       // Token & email remove
//       await AsyncStorage.removeItem('userToken');
//       await AsyncStorage.removeItem('userEmail');

//       // Reset navigation to Login screen
//       navigation.navigate("HomeDetail");
//     } catch (error) {
//       console.log('Logout error:', error);
//     }
//   };
//   return (
//     <View>
//       <Text>HomeScreen</Text>
//       {/* <Button title='Logout' onPress={handleLogout} /> */}
//     </View>
//   )
// }

// export default HomeScreen

// const styles = StyleSheet.create({})