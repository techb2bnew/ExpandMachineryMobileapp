import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import colors from '../constans/Color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP } from '../utils';

const CustomerFormScreen = ({ route, navigation }) => {
  const { type, customerData } = route.params || {}; // type: 'edit' | 'add'

  const isEdit = type === 'edit';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isEdit && customerData) {
      setFirstName(customerData.firstName || '');
      setLastName(customerData.lastName || '');
      setEmail(customerData.email || '');
      setPhone(customerData.phone || '');
    }
  }, [customerData]);

  const handleSave = () => {
    const payload = { firstName, lastName, email, phone };
    if (isEdit) {
      console.log('Updating customer:', payload);
    } else {
      console.log('Adding customer:', payload);
    }
    navigation.goBack();
  };

  return (

    <SafeAreaView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {isEdit ? 'Edit Customer' : 'Add Customer'}
      </Text>
      <Text style={styles.subtitle}>
        {isEdit
          ? `Update agent information for ${customerData?.firstName || ''} ${
              customerData?.lastName || ''
            }`
          : 'Enter new customer information'}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name*</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          placeholder="Enter first name"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name*</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          placeholder="Enter last name"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email*</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          placeholder="Enter email"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>
            {isEdit ? 'Update & Save' : 'Add Customer'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CustomerFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop:20
  },
  content: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    color: colors.accentGold,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    // flex: 1,
    width:widthPercentageToDP(20),
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
    borderWidth:1,
    borderColor:colors.textPrimary
  },
  saveBtn: {
   width:widthPercentageToDP(40),
    backgroundColor: colors.accentGold,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  saveText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
