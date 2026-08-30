import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES } from '../constants/theme';

export default function Splash({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding1');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom']}
      onTouchEnd={() => navigation.replace('Onboarding1')}
    >
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={40}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.title}>Food Flow</Text>
        <Text style={styles.tagline}>Delicious Food, Deliverde Fast</Text>

        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '28%',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h3,
    color: COLORS.white,
    marginTop: SIZES.spacing.lg,
  },
  tagline: {
    fontFamily: FONT.regular,
    fontSize: SIZES.body,
    color: COLORS.white,
    marginTop: SIZES.spacing.sm,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.white,
  },
});
