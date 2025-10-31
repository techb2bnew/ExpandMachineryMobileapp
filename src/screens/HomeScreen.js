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
    if (category.id <= 3) {
      navigation.navigate('SelectEquipment', {
        supportType: category.title
      });
    } else {
      // 4th card (Sales Support) goes to Issue Description directly
      navigation.navigate('IssueDescription', {
        supportType: category.title,
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
          <FlatList
            data={supportCategories}
            keyExtractor={(item) => item.id.toString()}
            horizontal={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryCard, flexDirectionRow, alignItemsCenter, { borderColor: item.iconColor, borderWidth: 0.5 }]}
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

// import React, { useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   TextInput,
//   Pressable,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Entypo from 'react-native-vector-icons/Entypo';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import colors from '../constans/Color';
// import { heightPercentageToDP, widthPercentageToDP } from '../utils';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const TABS = ['Customer Management', 'Tickets & Communication'];

// const HomeScreen = ({ navigation }) => {
//   const [activeTab, setActiveTab] = useState('Customer Management');

//   // popups
//   const [openActionFor, setOpenActionFor] = useState(null);
//   const [showStatus, setShowStatus] = useState(false);
//   const [showCat, setShowCat] = useState(false);

//   const [status, setStatus] = useState('All Status');
//   const [category, setCategory] = useState('All Categories');
//   const [search, setSearch] = useState('');

//   const customers = [
//     { id: 1, name: 'John Smith', email: 'smith@gmail.com' },
//     { id: 2, name: 'Alexa', email: 'xa@gmail.com' },
//     { id: 3, name: 'David', email: 'david@gmail.com' },
//     { id: 4, name: 'Faddy', email: 'faddy@gmail.com' },
//     { id: 5, name: 'Sam', email: 'sam@gmail.com' },
//   ];
//   const tickets = [
//     { id: 1, name: 'EXP12345679', customer: 'Sarah Johnson' },
//     { id: 2, name: 'EXP12345680', customer: 'John Smith' },
//     { id: 3, name: 'EXP12345685', customer: 'Davis Mike' },
//     { id: 4, name: 'EXP12345630', customer: 'Faddy' },
//     { id: 5, name: 'EXP12345679', customer: 'Allen dina' },
//   ];

//   const cards =
//     activeTab === 'Customer Management'
//       ? [
//           { value: '120', label: 'Total Customer', color: colors.red },
//           { value: '95', label: 'Online Customer', color: colors.orange },
//           { value: '25', label: 'New Today', color: colors.green },
//           { value: '12', label: 'This Month', color: colors.pink },
//         ]
//       : [
//           { value: '50', label: 'Total Tickets', color: colors.red },
//           { value: '5', label: 'Pending', color: colors.pink },
//           { value: '1', label: 'In Progress', color: colors.green },
//           { value: '1', label: 'Resolved', color: colors.orange },
//         ];

//   const columns = useMemo(() => {
//     return activeTab === 'Customer Management'
//       ? [
//           { key: 'name', title: 'Name', flex: 1.1 },
//           { key: 'email', title: 'Email', flex: 1.1 },
//         ]
//       : [
//           { key: 'name', title: 'Name', flex: 1.1 },
//           { key: 'customer', title: 'Customer', flex: 1.1 },
//         ];
//   }, [activeTab]);

//   const data = activeTab === 'Customer Management' ? customers : tickets;

//   const closeAll = () => {
//     setOpenActionFor(null);
//     setShowStatus(false);
//     setShowCat(false);
//   };

//   const ActionDropdown = ({ itemId, onSelect }) => {
//     if (openActionFor !== itemId) return null;

//     return (
//       <View
//         style={{
//           position: 'absolute',
//           width: widthPercentageToDP(22),
//           top: 48,
//           right: 5,
//           backgroundColor: '#fff',
//           borderRadius: 10,
//           elevation: 10,
//           shadowColor: '#000',
//           paddingVertical: 6,
//           zIndex: 20,
//         }}
//       >
//         {/* View */}
//         <TouchableOpacity
//           style={styles.menuItem}
//           onPress={() => {
//             onSelect('view');
//             setOpenActionFor(null);
//             navigation.navigate('CustomerDetails');
//           }}
//         >
//           <Text style={styles.menuText}>View</Text>
//         </TouchableOpacity>

//         <View style={styles.menuDivider} />

//         {/* Edit */}
//         <TouchableOpacity
//           style={styles.menuItem}
//           onPress={() => {
//             onSelect('edit');
//             setOpenActionFor(null);
//             navigation.navigate('CustomerForm', {
//               type: 'edit',
//               customerData: onSelect,
//             });
//           }}
//         >
//           <Text style={styles.menuText}>Edit</Text>
//         </TouchableOpacity>

//         <View style={styles.menuDivider} />

//         {/* Delete */}
//         <TouchableOpacity
//           style={styles.menuItem}
//           onPress={() => {
//             onSelect('delete');
//             setOpenActionFor(null);
//           }}
//         >
//           <Text style={[styles.menuText, { color: colors.red }]}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const Dropdown = ({ open, setOpen, value, setValue, items }) => (
//     <View style={{ flex: 1, marginRight: 10 }}>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         style={styles.ddTrigger}
//         onPress={() => {
//           setShowStatus(false);
//           setShowCat(false);
//           setOpen(!open);
//         }}
//       >
//         <Text style={styles.ddTriggerText}>{value}</Text>
//         <Entypo
//           name={open ? 'chevron-up' : 'chevron-down'}
//           size={16}
//           color={colors.textPrimary}
//         />
//       </TouchableOpacity>
//       {open && (
//         <View style={styles.menu /* reuse white dropdown */}>
//           {items.map((it, idx) => (
//             <TouchableOpacity
//               key={idx}
//               style={styles.menuItem}
//               onPress={() => {
//                 setValue(it);
//                 setOpen(false);
//               }}
//             >
//               {/* andar ka text BLACK */}
//               <Text style={[styles.menuText, { color: '#000' }]}>{it}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );

//   const renderRow = ({ item }) => (
//     <View style={styles.row}>
//       {columns.map(col => (
//         <Text key={col.key} style={[styles.cell, { flex: col.flex }]}>
//           {item[col.key]}
//         </Text>
//       ))}

//       <TouchableOpacity
//         style={styles.actionBtn}
//         onPress={() =>
//           setOpenActionFor(openActionFor === item.id ? null : item.id)
//         }
//       >
//         <Entypo
//           name="dots-three-vertical"
//           size={18}
//           color={colors.textPrimary}
//         />
//       </TouchableOpacity>

//       {/* Actions dropdown (white, black text) */}
//       <ActionDropdown
//         itemId={item.id}
//         onSelect={k => console.log('action:', k, item)}
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       {(openActionFor !== null || showStatus || showCat) && (
//         <Pressable style={StyleSheet.absoluteFill} onPress={closeAll} />
//       )}

//       {/* SINGLE segmented tab group */}
//       <View style={styles.tabsWrap}>
//         <View style={styles.tabsGroup}>
//           {TABS.map((tab, index) => {
//             const active = activeTab === tab;
//             const isFirst = index === 0;
//             const isLast = index === TABS.length - 1;

//             return (
//               <TouchableOpacity
//                 key={tab}
//                 style={[
//                   styles.tabBtn,
//                   active ? styles.tabActive : styles.tabInactive,
//                   isFirst && styles.firstTab, // left rounded
//                   isLast && styles.lastTab, // right rounded
//                 ]}
//                 onPress={() => {
//                   setActiveTab(tab);
//                   closeAll();
//                 }}
//               >
//                 <Text style={[styles.tabText, active && styles.tabTextActive]}>
//                   {tab}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       </View>

//       {/* KPIs */}
//       <View style={styles.cardContainer}>
//         {cards.map((c, i) => (
//           <View key={i} style={[styles.card, { borderColor: c.color }]}>
//             <Text style={[styles.cardValue, { color: c.color }]}>
//               {c.value}
//             </Text>
//             <Text style={styles.cardLabel}>{c.label}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Search heading + box */}
//       <Text style={styles.searchHeading}>Search</Text>
//       <View style={styles.searchWrap}>
//         <TextInput
//           value={search}
//           onChangeText={setSearch}
//           style={styles.searchInput}
//           placeholder="Search by name, email or phone..."
//           placeholderTextColor={colors.textSecondary}
//         />
//         <AntDesign
//           name="search1"
//           size={18}
//           color={colors.textPrimary}
//           style={styles.searchIcon}
//         />
//       </View>

//       {/* Filters visible only on Tickets tab */}
//       {activeTab === 'Tickets & Communication' && (
//         <View style={styles.filterRow}>
//           <Dropdown
//             open={showStatus}
//             setOpen={setShowStatus}
//             value={status}
//             setValue={setStatus}
//             items={['All Status', 'Pending', 'In Progress', 'Resolved']}
//           />
//           <Dropdown
//             open={showCat}
//             setOpen={setShowCat}
//             value={category}
//             setValue={setCategory}
//             items={['All Categories', 'Warranty', 'Repair', 'Billing', 'Other']}
//           />
//           <View style={{ width: 10 }} />
//         </View>
//       )}

//       {/* Header aligned with cells */}
//       <View style={styles.headerRow}>
//         {columns?.map(col => (
//           <Text key={col.key} style={[styles.headerText, { flex: col.flex }]}>
//             {col.title}
//           </Text>
//         ))}
//         <Text style={[styles.headerText, { width: 64, textAlign: 'right' }]}>
//           Actions
//         </Text>
//       </View>

//       <FlatList
//         data={data}
//         keyExtractor={it => String(it.id)}
//         renderItem={renderRow}
//         contentContainerStyle={{ paddingBottom: 24 }}
//         showsVerticalScrollIndicator={false}
//       />
//       {/* Customer add button  */}
//       {activeTab === 'Customer Management' && (
//         <TouchableOpacity
//           style={styles.fab}
//           onPress={() =>
//             navigation.navigate('CustomerForm', {
//               type: 'add',
//             })
//           }
//         >
//           <Icon name="add" size={32} color="#000" />
//         </TouchableOpacity>
//       )}
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background },

//   // tabs (single group with two buttons flush)
//   tabsWrap: { paddingHorizontal: 16, marginTop: 8 },
//   tabsGroup: {
//     flexDirection: 'row',
//     backgroundColor: colors.cardBg,
//     borderRadius: 14,
//     padding: 4,
//   },
//   tabBtn: {
//     flex: 1,
//     paddingVertical: 10,
//     paddingHorizontal: 22,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 0,
//   },
//   tabActive: { backgroundColor: colors.accentGold },
//   tabInactive: { backgroundColor: '#FFFFFF' }, // inactive white
//   tabText: {
//     fontWeight: '600',
//     color: colors.cardBg,
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   tabTextActive: { color: colors.textPrimary },
//   firstTab: {
//     borderTopRightRadius: 0,
//     borderBottomRightRadius: 0,
//   },
//   lastTab: {
//     borderTopLeftRadius: 0,
//     borderBottomLeftRadius: 0,
//   },

//   // KPIs
//   cardContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginHorizontal: 12,
//     marginTop: 14,
//   },
//   card: {
//     width: widthPercentageToDP(46),
//     backgroundColor: colors.cardBg,
//     borderWidth: 0.2,
//     borderRadius: 12,
//     paddingVertical: 20,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cardValue: { fontSize: 26, fontWeight: '800' },
//   cardLabel: {
//     marginTop: 6,
//     color: colors.textPrimary,
//     fontWeight: '600',
//     fontSize: 15,
//   },

//   // search
//   searchHeading: {
//     marginHorizontal: 16,
//     marginTop: 8,
//     marginBottom: 4,
//     color: colors.textPrimary,
//     fontWeight: '700',
//   },
//   searchWrap: {
//     marginHorizontal: 12,
//     borderWidth: 1,
//     borderRadius: 12,
//     borderColor: colors.textSecondary,
//   },
//   searchInput: {
//     backgroundColor: colors.cardBg,
//     color: colors.textPrimary,
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     paddingRight: 36,
//   },
//   searchIcon: { position: 'absolute', right: 12, top: 13 },

//   // filters
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 12,
//     marginTop: 10,
//   },
//   ddTrigger: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     // backgroundColor: colors.cardBg,
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.textPrimary,
//   },
//   ddTriggerText: { color: colors.textPrimary, fontWeight: '600' },
//   // white dropdown (used for both filters + actions)
//   menu: {
//     position: 'absolute',
//     top: 48,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 10,
//     shadowColor: '#000',
//     paddingVertical: 6,
//     zIndex: 20,
//   },
//   menuItem: { paddingVertical: 8, paddingHorizontal: 12 },
//   menuText: { color: '#000', fontWeight: '500' }, // BLACK text inside menus
//   menuDivider: { height: 1, backgroundColor: colors.border, opacity: 0.6 },

//   // table
//   headerRow: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     marginTop: 8,
//   },
//   headerText: { color: colors.textPrimary, fontWeight: '700' },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//     position: 'relative',
//   },
//   cell: { color: colors.textPrimary },
//   actionBtn: { width: 64, alignItems: 'flex-end' },
//   fab: {
//     width: widthPercentageToDP(14),
//     height: heightPercentageToDP(6.5),
//     borderRadius: 30,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'absolute',
//     bottom: 40,
//     right: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 3,
//   },
// });