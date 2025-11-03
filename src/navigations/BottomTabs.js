import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import InboxStack from './InboxStack';
import NotificationsStack from './NotificationsStack';
import AccountStack from './AccountStack';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { View, Text, StyleSheet } from 'react-native';
import {
  darkgrayColor,
  whiteColor,
  lightPinkAccent,
  grayColor,
  lightColor,
} from '../constans/Color';
import { spacings } from '../constans/Fonts';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

// Custom tab bar icon component
const CustomTabIcon = ({ focused, iconName, badge, IconComponent }) => {
  return (
    <View style={styles.iconContainer}>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
        <IconComponent
          name={iconName}
          size={22}
          color={focused ? whiteColor : whiteColor}
        />
      </View>
    </View>
  );
};

// Custom tab bar label component
const CustomTabLabel = ({ focused, label }) => {
  return (
    <View style={styles.labelContainer}>
      <Text style={[styles.labelText, focused && styles.activeLabelText]}>
        {label}
      </Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
};
function getRouteHiddenTabs(routeName) {
  // in screens pr tab hide karna hai
  const hiddenRoutes = ['SelectEquipment'];

  return hiddenRoutes.includes(routeName);
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
    style={{backgroundColor:"red"}}
      screenOptions={({ route }) => {
        // 👇 Nested route ka naam le lo
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';

        // jin screens pe tab bar hide karni hai
        const hiddenRoutes = [
          'SelectEquipment',
          'IssueDescription',
          'RequestSubmitted',
          'SupportChat',
          'TicketDetail',
          'Auth',
        ];

        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              backgroundColor: lightColor,
              borderTopWidth: 1,
              height: 80,
              paddingBottom: 15,
              paddingTop: 10,
              borderTopColor: grayColor,
            },
            hiddenRoutes.includes(routeName) && { display: 'none' },
          ],
          tabBarIcon: ({ focused }) => {
            let iconName;
            let badge = null;
            let iconType = Icon;

            if (route.name === 'HomeTab')
              (iconName = 'home'), (iconType = Feather);
            if (route.name === 'InboxTab')
              (iconName = 'inbox'), (iconType = Feather);
            if (route.name === 'NotificationsTab') {
              (iconName = 'notifications-outline'), (iconType = Icon);
              badge = 2;
            }
            if (route.name === 'AccountTab')
              (iconName = 'user'), (iconType = Feather);

            return (
              <CustomTabIcon
                focused={focused}
                iconName={iconName}
                IconComponent={iconType}
                badge={badge}
              />
            );
          },
          tabBarLabel: ({ focused }) => {
            let label;
            if (route.name === 'HomeTab') label = 'Home';
            if (route.name === 'InboxTab') label = 'Inbox';
            if (route.name === 'NotificationsTab') label = 'Notifications';
            if (route.name === 'AccountTab') label = 'Account';

            return <CustomTabLabel focused={focused} label={label} />;
          },
        };
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            navigation.navigate('HomeTab', { screen: 'HomeScreen' });
          },
        })}
      />
      <Tab.Screen
        name="InboxTab"
        component={InboxStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            navigation.navigate('InboxTab', { screen: 'InboxScreen' });
          },
        })}
      />
      {/* <Tab.Screen
        name="NotificationsTab"
        component={NotificationsStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            navigation.navigate('NotificationsTab', {
              screen: 'NotificationsScreen',
            });
          },
        })}
      /> */}
      <Tab.Screen
        name="AccountTab"
        component={AccountStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            navigation.navigate('AccountTab', { screen: 'AccountScreen' });
          },
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrapper: {
    backgroundColor: lightPinkAccent,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: lightPinkAccent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: whiteColor,
    fontSize: 12,
    fontWeight: 'bold',
  },
  labelContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  labelText: {
    color: whiteColor,
    fontSize: 12,
    fontWeight: '400',
  },
  activeLabelText: {
    fontWeight: '500',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: lightPinkAccent,
    marginTop: 4,
  },
});
