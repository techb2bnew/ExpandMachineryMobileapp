import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import InboxStack from './InboxStack';
import ChatStack from './ChatStack';
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
import { getFocusedRouteNameFromRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnreadCounts } from '../store/slices/unreadCountSlice';
import { useCallback } from 'react';

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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Get unread counts from Redux store
  const inboxUnread = useSelector((state) => state.unreadCount.inboxUnread);
  const chatUnread = useSelector((state) => state.unreadCount.chatUnread);

  // Fetch counts whenever BottomTabs screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Fetch unread counts when tab bar comes into focus
      dispatch(fetchUnreadCounts());
    }, [dispatch])
  );

  // Listen to navigation state changes - fetch counts on any navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      // Fetch counts on any navigation state change
      dispatch(fetchUnreadCounts());
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  return (
    <Tab.Navigator
      style={{ backgroundColor: 'red' }}
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
            if (route.name === 'InboxTab') {
              (iconName = 'inbox'), (iconType = Feather);
              // Show inbox unread count badge
              badge = inboxUnread > 0 ? inboxUnread : null;
            }
            if (route.name === 'ChatTab') {
              (iconName = 'chatbubbles-outline'), (iconType = Icon);
              // Show chat unread count badge
              badge = chatUnread > 0 ? chatUnread : null;
            }
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
            if (route.name === 'ChatTab') label = 'Chat';
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
            // Fetch counts when inbox tab is pressed
            dispatch(fetchUnreadCounts());
            navigation.navigate('InboxTab', { screen: 'InboxMain' });
          },
        })}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            // Fetch counts when chat tab is pressed
            dispatch(fetchUnreadCounts());
            navigation.navigate('ChatTab', { screen: 'ChatList' });
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
