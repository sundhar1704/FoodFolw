import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT, SIZES } from '../constants/theme';
import PrimaryButton from './PrimaryButton';

// Cap the layout to a typical phone width so it doesn't stretch full-bleed
// on a wide desktop browser (Expo web has no viewport limit by default).
const { width: windowWidth } = Dimensions.get('window');
const MAX_CONTENT_WIDTH = 430;
const CONTENT_WIDTH = Math.min(windowWidth, MAX_CONTENT_WIDTH);
const IMAGE_WIDTH = CONTENT_WIDTH * 0.72;

/**
 * Shared layout for the 3 onboarding slides.
 * activeIndex: 0 | 1 | 2 — controls which pagination dot is the active pill
 */
export default function OnboardingLayout({
  image,
  title,
  description,
  activeIndex,
  onNext,
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageWrapper}>
            <Image source={image} style={styles.image} resizeMode="cover" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.dotsRow}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex && styles.dotActive]}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonWrapper}>
          <PrimaryButton title="NEXT" onPress={onNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 1.28,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: FONT.regular,
    fontSize: SIZES.h2,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.lg,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.lg,
    lineHeight: 22,
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
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: COLORS.primary,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: SIZES.spacing.md,
  },
});
