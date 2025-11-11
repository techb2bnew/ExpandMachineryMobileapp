
import { Dimensions, PixelRatio } from 'react-native';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { API_ENDPOINTS } from './constans/Constants';

// Global navigation ref - will be set from App.tsx
let globalNavigationRef: any = null;

export const setNavigationRef = (ref: any) => {
  globalNavigationRef = ref;
};

export const widthPercentageToDP = (widthPercent: any) => {
  const screenWidth = Dimensions.get('window').width;
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export const heightPercentageToDP = (heightPercent: any) => {
  const screenHeight = Dimensions.get('window').height;
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

/**
 * Checks if an error message indicates an authentication/token error
 */
export const checkAuthError = (errorMessage: string | null | undefined): boolean => {
  if (!errorMessage) return false;
  
  const lowerMessage = errorMessage.toLowerCase();
  
  const authErrorPatterns = [
    'invalid token',
    'token expired',
    'token invalid',
    'please login again',
    'authentication failed',
    'unauthorized',
    'token not found',
    'session expired',
    'login required',
    'token has been revoked',
    'token is expired',
    'authentication token not found',
    'No authentication token',
    // account state related messages that should force logout
    'account has been deleted',
    'account deleted',
    'account is deleted',
    'account disabled',
    'user disabled',
  ];
  
  return authErrorPatterns.some(pattern => lowerMessage.includes(pattern));
};

/**
 * Performs global logout - clears storage and navigates to login
 */
const performGlobalLogout = async (): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    // Call logout API if token exists
    if (token) {
      try {
        await fetch(`${API_ENDPOINTS.BASE_URL}/api/app/auth/logout`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {
          // Ignore logout API errors
        });
      } catch (apiError) {
        console.log('Logout API Error:', apiError);
      }
    }
    
    // Clear all stored data
    await AsyncStorage.multiRemove(['userToken', 'userData', 'userRole']);
    // console.log('Global logout: User logged out due to auth error');
    
    // Navigate to Login screen using global navigation ref
    if (globalNavigationRef?.isReady()) {
      globalNavigationRef.navigate('Auth')
    }
  } catch (error) {
    console.log('Global logout error:', error);
    // Even if logout fails, try to navigate
    if (globalNavigationRef?.isReady()) {
      globalNavigationRef.navigate('Auth')
    }
  }
};

/**
 * Global Fetch Wrapper - Automatically handles auth errors
 * Use this instead of regular fetch() for all API calls
 * 
 * @param url - API endpoint URL (full URL or relative path)
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise<Response>
 * 
 * @example
 * // Instead of:
 * const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/app/profile`, {
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 * 
 * // Use:
 * const response = await fetchWithAuth(`${API_ENDPOINTS.BASE_URL}/api/app/profile`);
 * // Token automatically added, auth errors automatically handled!
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
console.log("token",token);

    // If no token and this is not a public endpoint, check if we should logout
    if (!token && !url.includes('/auth/login') && !url.includes('/auth/register')) {
      // console.log('No token found - redirecting to login');
      await performGlobalLogout();
      throw new Error('No authentication token');
    }

    // Add Authorization header if token exists
    const headers: any = {
      Accept: 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // For FormData, don't set Content-Type (browser sets it automatically with boundary)
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    } else if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Merge headers with existing options
    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    // Make API call
    const response = await fetch(url, fetchOptions);

    // Clone response to read body for auth check while preserving original
    const responseClone = response.clone();
    
    // Parse cloned response to check for auth errors
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await responseClone.text();
        responseData = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.log('JSON parse error:', parseError);
        responseData = {};
      }
    } else {
      responseData = {};
    }

    // Check for auth errors in response (both error and success responses)
    const errorMessage = responseData?.message || responseData?.error || '';
    
    if (checkAuthError(errorMessage)) {
      // console.log('Auth error detected in API response:', errorMessage);
      await performGlobalLogout();
      throw new Error(errorMessage);
    }

    // Return original response (body not consumed)
    return response;
  } catch (error: any) {
    // If error is auth-related, logout has already been handled
    if (error?.message && checkAuthError(error.message)) {
      throw error;
    }
    
    // Re-throw other errors
    throw error;
  }
};

