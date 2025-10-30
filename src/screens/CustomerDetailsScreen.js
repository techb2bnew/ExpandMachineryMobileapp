import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constans/Color';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomerDetailsScreen = ({ route }) => {
  const customer = route?.params?.customer || {
    id: '#0003',
    name: 'John Smith',
    email: 'johnsmith@gmail.com',
    phone: '+1 555 555 0003',
    status: 'Online',
    joinDate: '15-02-2025',
    lastLoginDate: '15-02-2025',
    lastLoginTime: '20.00.00',
  };

  const isOnline = customer.status.toLowerCase() === 'online';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Customer Details</Text>
      <Text style={styles.subtitle}>View detail of customer</Text>

      <Text style={styles.customerId}>{customer.id}</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{customer.name}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{customer.email}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>{customer.phone}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <View
            style={[
              styles.statusBox,
              {
                backgroundColor: isOnline
                  ? colors.statusGreen
                  : colors.statusRed,
              },
            ]}
          >
            <Text style={styles.statusText}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Join Date</Text>
          <Text style={styles.value}>{customer.joinDate}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Last Login</Text>
          <Text style={styles.value}>
            {customer.lastLoginDate} | {customer.lastLoginTime}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomerDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    color: colors.accentGold,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customerId: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,

    // marginBottom: 14,
    backgroundColor: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  value: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'right',
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.8,
  },
  statusBox: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
