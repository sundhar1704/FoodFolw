import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'foodflow_isLoggedIn';

/** Call this after a successful login/signup */
export async function setLoggedIn() {
  try {
    await AsyncStorage.setItem(AUTH_KEY, 'true');
  } catch (e) {
    console.warn('Failed to save login state', e);
  }
}

/** Call this on app launch to check if the user is already logged in */
export async function getIsLoggedIn() {
  try {
    const value = await AsyncStorage.getItem(AUTH_KEY);
    return value === 'true';
  } catch (e) {
    console.warn('Failed to read login state', e);
    return false;
  }
}

/** Call this on logout */
export async function clearLoggedIn() {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.warn('Failed to clear login state', e);
  }
}