import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES } from '../constants/theme';

export default function FormInput({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  isPassword = false,
  showPassword,
  onTogglePassword,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={COLORS.textTertiary}
          style={styles.leftIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {isPassword && (
          <TouchableOpacity onPress={onTogglePassword} hitSlop={10}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={COLORS.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.spacing.md,
  },
  label: {
    fontFamily: FONT.medium,
    fontSize: SIZES.bodySmall,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.spacing.md,
    height: 54,
  },
  leftIcon: {
    marginRight: SIZES.spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
});
