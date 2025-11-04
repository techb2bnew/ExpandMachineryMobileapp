import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import colors from '../constans/Color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constans/Constants';

const CustomerFormScreen = ({ route, navigation }) => {
  const { type, customerData } = route.params || {}; // type: 'edit' | 'add'
  const isEdit = type === 'edit';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // field-level errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.log('error reading token', e);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (isEdit && customerData) {
      setFirstName(customerData?.firstName || '');
      setLastName(customerData?.lastName || '');
      setEmail(customerData?.email || '');
      setPhone(String(customerData?.phone || ''));
      // password hidden in edit
    }
  }, [customerData, isEdit]);

  const validate = () => {
    const next = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    };
    const trim = v => (v || '').trim();

    // required checks
    if (!trim(firstName)) next.firstName = 'First name is required.';
    if (!trim(lastName)) next.lastName = 'Last name is required.';
    if (!trim(email)) next.email = 'Email is required.';
    if (!trim(phone)) next.phone = 'Phone number is required.';

    // email regex (simple & safe)
    const emailOK = /^\S+@\S+\.\S+$/.test(trim(email));
    if (trim(email) && !emailOK) next.email = 'Enter a valid email address.';

    // phone: exactly 10 digits
    const digits = (phone || '').replace(/\D/g, '');
    if (trim(phone) && digits.length !== 10) {
      next.phone = 'Phone must be exactly 10 digits.';
    }

    // password: only on ADD
    if (!isEdit) {
      if (!trim(password)) next.password = 'Password is required.';
      if (trim(password) && password.length < 8) {
        next.password = 'Password must be at least 8 characters.';
      }
    }

    setErrors(next);

    // return valid?
    return !Object.values(next).some(Boolean);
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const urlBase = `${API_ENDPOINTS.BASE_URL}/api/app/agent/customers`;
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      };
      const body = { firstName, lastName, email, phone };
      if (isEdit) {
        // UPDATE
        const res = await fetch(`${urlBase}/${customerData._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to update customer');
      } else {
        // CREATE (include password if provided)
        const createBody = password ? { ...body, password } : body;
        console.log('createBody', createBody);

        const res = await fetch(urlBase, {
          method: 'POST',
          headers,
          body: JSON.stringify(createBody),
        });
        console.log('resres', res);
        if (!res.ok) throw new Error('Failed to add customer');
      }
      navigation.navigate('HomeMain');
    } catch (err) {
      console.log('Save error:', err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
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
          onChangeText={t => {
            setFirstName(t);
            if (errors.firstName) setErrors({ ...errors, firstName: '' });
          }}
          style={styles.input}
          placeholder="Enter first name"
          placeholderTextColor={colors.textSecondary}
        />
        {!!errors.firstName && (
          <Text style={styles.error}>{errors.firstName}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name*</Text>
        <TextInput
          value={lastName}
          onChangeText={t => {
            setLastName(t);
            if (errors.lastName) setErrors({ ...errors, lastName: '' });
          }}
          style={styles.input}
          placeholder="Enter last name"
          placeholderTextColor={colors.textSecondary}
        />
        {!!errors.lastName && (
          <Text style={styles.error}>{errors.lastName}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email*</Text>
        <TextInput
          value={email}
          onChangeText={t => {
            setEmail(t);
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter email"
          placeholderTextColor={colors.textSecondary}
        />
        {!!errors.email && <Text style={styles.error}>{errors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number*</Text>
        <TextInput
          value={phone}
          onChangeText={t => {
            // allow only digits in UI too (optional). Comment next line if you want to allow spaces/dashes.
            const onlyDigits = t.replace(/\D/g, '');
            setPhone(onlyDigits);
            if (errors.phone) setErrors({ ...errors, phone: '' });
          }}
          style={styles.input}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="Enter phone number"
          placeholderTextColor={colors.textSecondary}
        />
        {!!errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
      </View>

      {!isEdit && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password*</Text>
          <TextInput
            value={password}
            onChangeText={t => {
              setPassword(t);
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            style={styles.input}
            secureTextEntry
            placeholder="Create password"
            placeholderTextColor={colors.textSecondary}
          />
          {!!errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
        </View>
      )}

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveText}>
              {isEdit ? 'Update & Save' : 'Add Customer'}
            </Text>
          )}
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
    paddingTop: 20,
  },
  content: { paddingVertical: 24 },
  title: { fontSize: 20, color: colors.accentGold, fontWeight: '700' },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 16 },
  label: { color: colors.textPrimary, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  error: { marginTop: 6, color: '#C62828', fontSize: 12, fontWeight: '600' },
  btnRow: { flexDirection: 'row', marginTop: 20 },
  cancelBtn: {
    width: widthPercentageToDP(20),
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.textPrimary,
  },
  saveBtn: {
    width: widthPercentageToDP(40),
    backgroundColor: colors.accentGold,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelText: { color: colors.textPrimary, fontWeight: '600' },
  saveText: { color: colors.textPrimary, fontWeight: '700' },
});
