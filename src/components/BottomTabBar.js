import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES } from '../constants/theme';

const TABS = [
  { key: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { key: 'Order', label: 'Order', icon: 'time-outline', iconActive: 'time' },
  { key: 'chats', label: 'chats', icon: 'bag-outline', iconActive: 'bag' },
  { key: 'Profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

/**
 * Simple visual bottom tab bar (not react-navigation tabs — the app is on a
 * single stack navigator for now). `active` controls which tab is highlighted.
 * `onTabPress(key)` fires when a tab is tapped.
 */
export default function BottomTabBar({ active = 'Home', onTabPress }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => onTabPress && onTabPress(tab.key)}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SIZES.spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  labelActive: {
    color: COLORS.primary,
    fontFamily: FONT.medium,
  },
});