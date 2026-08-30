import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import AuthTabs from '../components/AuthTabs';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import SocialButton from '../components/SocialButton';
import { setLoggedIn } from '../utils/authStorage';
import BackButton from '../components/BackButton';

const { width: windowWidth } = Dimensions.get('window');
const MAX_CONTENT_WIDTH = 430;

// ---- Validation helpers ----------------------------------------------

// Simple @ check, as requested — not a full RFC email regex.
function isValidEmail(value) {
  const trimmed = value.trim();
  if (trimmed.length < 3) return false;
  if (!trimmed.includes('@')) return false;
  // must have at least one char before @ and a dot after @
  const [local, domain] = trimmed.split('@');
  return local.length > 0 && domain && domain.includes('.');
}

// Strong password: min 8 chars, at least one uppercase, one lowercase, one number.
function getPasswordError(value) {
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(value)) return 'Password must include at least one uppercase letter.';
  if (!/[a-z]/.test(value)) return 'Password must include at least one lowercase letter.';
  if (!/[0-9]/.test(value)) return 'Password must include at least one number.';
  return null;
}

export default function Login({ navigation }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Extra Sign up fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  // 'idle' | 'loading' | 'success'
  const [status, setStatus] = useState('idle');

  const isLogin = mode === 'login';

  const completeLogin = async (successMessage) => {
    setStatus('loading');

    // TODO: swap for real auth (email/password or OAuth) once the backend exists.
    await setLoggedIn();

    setStatus('success');
    Alert.alert('Success', successMessage);

    setTimeout(() => {
      navigation.replace('Home');
    }, 1200);
  };

  const handleSubmit = async () => {
    // --- Sign up specific checks ---
    if (!isLogin) {
      if (!name.trim()) {
        Alert.alert('Missing info', 'Please enter your name.');
        return;
      }
      const ageNum = parseInt(age, 10);
      if (!age.trim() || isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        Alert.alert('Invalid age', 'Please enter a valid age (13 or older).');
        return;
      }
    }

    // --- Shared checks ---
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing info', 'Please enter both your email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address containing "@", e.g. name@example.com.');
      return;
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      Alert.alert('Weak password', passwordError);
      return;
    }

    await completeLogin(isLogin ? 'Login successful!' : 'Account created!');
  };

  const goToSocialAuth = (provider) => {
    navigation.navigate('SocialAuth', { provider });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {navigation.canGoBack() && (
              <BackButton
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              />
            )}

            {/* Logo */}
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={40}
                color={COLORS.white}
              />
            </View>

            <Text style={styles.title}>Welcome to Food Flow</Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Log in to continue ordering'
                : 'Create your account to start ordering'}
            </Text>

            <View style={styles.tabsWrapper}>
              <AuthTabs mode={mode} onChange={setMode} />
            </View>

            {status === 'success' && (
              <View style={styles.successBanner}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color={COLORS.success}
                />
                <Text style={styles.successText}>
                  {isLogin ? 'Login successful!' : 'Account created!'} Redirecting you to Home…
                </Text>
              </View>
            )}

            {/* ---- Sign up only fields ---- */}
            {!isLogin && (
              <>
                <FormInput
                  label="Full Name"
                  icon="account-outline"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
                <FormInput
                  label="Age"
                  icon="calendar-outline"
                  placeholder="Enter your age"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                />
              </>
            )}

            <FormInput
              label="Email"
              icon="email-outline"
              placeholder={isLogin ? 'Enter your Email' : 'Create your Email (e.g. name@example.com)'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <FormInput
              label="Password"
              icon="lock-outline"
              placeholder={isLogin ? 'Enter your Password' : '8+ chars, upper, lower & number'}
              value={password}
              onChangeText={setPassword}
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
            />

            {!isLogin && (
              <Text style={styles.passwordHint}>
                Use 8+ characters with uppercase, lowercase and a number (e.g. Food123flow).
              </Text>
            )}

            {isLogin && (
              <TouchableOpacity style={styles.forgotWrapper}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <View style={{ marginTop: isLogin ? SIZES.spacing.md : SIZES.spacing.lg }}>
              <PrimaryButton
                title={isLogin ? 'Login' : 'Create Account'}
                onPress={handleSubmit}
                loading={status === 'loading'}
                disabled={status !== 'idle'}
              />
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <SocialButton
              provider="google"
              label="Continue with Google"
              onPress={() => goToSocialAuth('google')}
            />
            <SocialButton
              provider="facebook"
              label="Continue with Facebook"
              onPress={() => goToSocialAuth('facebook')}
            />
            <SocialButton
              provider="apple"
              label="Continue with Apple"
              onPress={() => goToSocialAuth('apple')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: SIZES.spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SIZES.screenPadding,
  },
  backButton: {
    marginTop: SIZES.spacing.sm,
    marginBottom: -SIZES.spacing.sm,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: SIZES.spacing.lg,
  },
  title: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SIZES.spacing.md,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  tabsWrapper: {
    marginTop: SIZES.spacing.lg,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.md,
    marginTop: SIZES.spacing.md,
  },
  successText: {
    flex: 1,
    marginLeft: SIZES.spacing.sm,
    fontFamily: FONT.medium,
    fontSize: SIZES.bodySmall,
    color: COLORS.success,
  },
  passwordHint: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacing.xs,
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: SIZES.spacing.sm,
  },
  forgotText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.bodySmall,
    color: COLORS.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  dividerText: {
    marginHorizontal: SIZES.spacing.sm,
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
  },
});