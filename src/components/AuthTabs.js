import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '../constants/theme';

export default function AuthTabs({ mode, onChange }) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.tab, mode === 'login' && styles.tabActive]}
        activeOpacity={0.8}
        onPress={() => onChange('login')}
      >
        <Text style={[styles.text, mode === 'login' && styles.textActive]}>
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, mode === 'signup' && styles.tabActive]}
        activeOpacity={0.8}
        onPress={() => onChange('signup')}
      >
        <Text style={[styles.text, mode === 'signup' && styles.textActive]}>
          Sign in
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusPill,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SIZES.radiusPill,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  text: {
    fontFamily: FONT.medium,
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
  },
  textActive: {
    color: COLORS.textPrimary,
  },
});
