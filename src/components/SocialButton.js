import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES } from '../constants/theme';
import GoogleIcon from './icons/GoogleIcon';

export default function SocialButton({ provider, label, onPress }) {
  const renderIcon = () => {
    switch (provider) {
      case 'google':
        return <GoogleIcon size={20} />;
      case 'facebook':
        return (
          <MaterialCommunityIcons name="facebook" size={20} color="#1877F2" />
        );
      case 'apple':
        return <Ionicons name="logo-apple" size={20} color={COLORS.textPrimary} />;
      default:
        return null;
    }
  };  

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      {renderIcon()}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.spacing.sm,
    marginTop: SIZES.spacing.sm,
    gap: 10,
  },
  label: {
    fontFamily: FONT.medium,
    fontSize: SIZES.bodySmall,
    color: COLORS.textPrimary,
  },
});