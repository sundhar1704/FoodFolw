import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import BackButton from '../components/BackButton';
import GoogleIcon from '../components/icons/GoogleIcon';
import { setLoggedIn } from '../utils/authStorage';

const MAX_CONTENT_WIDTH = 430;

// Per-provider branding. Add more providers here later if needed.
const PROVIDER_CONFIG = {
  google: {
    label: 'Google',
    renderIcon: (size) => <GoogleIcon size={size} />,
  },
  facebook: {
    label: 'Facebook',
    renderIcon: (size) => (
      <MaterialCommunityIcons name="facebook" size={size} color="#1877F2" />
    ),
  },
  apple: {
    label: 'Apple',
    renderIcon: (size) => (
      <Ionicons name="logo-apple" size={size} color={COLORS.textPrimary} />
    ),
  },
};

function isValidEmail(value) {
  const trimmed = value.trim();
  if (trimmed.length < 3 || !trimmed.includes('@')) return false;
  const [local, domain] = trimmed.split('@');
  return local.length > 0 && !!domain && domain.includes('.');
}

export default function SocialAuth({ route, navigation }) {
  const { provider } = route.params;
  const config = PROVIDER_CONFIG[provider];

  const [step, setStep] = useState('email'); // 'email' | 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const handleBack = () => {
    if (step === 'password') {
      setStep('email');
    } else {
      navigation.goBack();
    }
  };

  const handleEmailNext = () => {
    if (!isValidEmail(email)) {
      Alert.alert(
        'Invalid email',
        `Enter the email address you use with ${config.label}.`
      );
      return;
    }
    setStep('password');
  };

  const handlePasswordNext = async () => {
    if (!password.trim()) {
      Alert.alert('Missing password', 'Please enter your password.');
      return;
    }

    setStatus('loading');

    // TODO: replace with the real provider OAuth token exchange once
    // Google/Facebook/Apple developer credentials are set up. For now this
    // just mirrors the email/password login so the flow can be demoed.
    await setLoggedIn();

    setStatus('success');
    Alert.alert('Success', `Signed in with ${config.label}!`);

    setTimeout(() => {
      navigation.replace('Home');
    }, 1000);
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
            <BackButton onPress={handleBack} style={styles.backButton} />

            <View style={styles.iconWrapper}>{config.renderIcon(40)}</View>

            <Text style={styles.title}>Sign in with {config.label}</Text>

            {step === 'email' ? (
              <>
                <Text style={styles.subtitle}>
                  Use your {config.label} account to continue to Food Flow.
                </Text>

                <FormInput
                  label="Email or phone"
                  icon="email-outline"
                  placeholder={`Enter your ${config.label} email`}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoFocus
                />

                <View style={styles.buttonRow}>
                  <PrimaryButton title="Next" onPress={handleEmailNext} />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.emailPill}>{email.trim()}</Text>

                <FormInput
                  label="Password"
                  icon="lock-outline"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                  autoFocus
                />

                <View style={styles.buttonRow}>
                  <PrimaryButton
                    title="Sign in"
                    onPress={handlePasswordNext}
                    loading={status === 'loading'}
                    disabled={status !== 'idle'}
                  />
                </View>
              </>
            )}
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
  iconWrapper: {
    alignItems: 'center',
    marginTop: SIZES.spacing.xl,
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
    marginTop: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.lg,
  },
  emailPill: {
    fontFamily: FONT.medium,
    fontSize: SIZES.bodySmall,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.divider,
    borderRadius: SIZES.radiusMd,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'center',
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    overflow: 'hidden',
  },
  buttonRow: {
    marginTop: SIZES.spacing.lg,
  },
});