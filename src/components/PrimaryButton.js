import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONT, SIZES } from '../constants/theme';

/**
 * Full-width, pill-shaped, orange primary button.
 * variant: 'filled' (default) | 'outline'
 */
export default function PrimaryButton({
  title,
  onPress,
  variant = 'filled',
  loading = false,
  disabled = false,
  style,
}) {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isOutline ? styles.outline : styles.filled,
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.white} />
      ) : (
        <Text style={[styles.text, isOutline ? styles.textOutline : styles.textFilled]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: 56,
    borderRadius: SIZES.radiusPill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: COLORS.primary,
  },
  outline: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  text: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
  },
  textFilled: {
    color: COLORS.white,
  },
  textOutline: {
    color: COLORS.primary,
  },
});
