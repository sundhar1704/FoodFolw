import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BackButton from '../components/BackButton';
import PrimaryButton from '../components/PrimaryButton';
import BottomTabBar from '../components/BottomTabBar';

const MAX_CONTENT_WIDTH = 430;

export default function Checkout({ navigation, route }) {
  // TODO: replace these defaults with the user's real saved address once
  // an address-management feature exists (see Profile > Addresses).
  const {
    addressLine1 = '123 Elm Street, Apt 4B',
    addressLine2 = 'New York, NY 10001',
    estimatedTime = '25-35 min',
  } = route.params || {};

  const handleTabPress = (key) => {
    if (key === 'Home') return navigation.navigate('Home');
    if (key === 'Order') return navigation.navigate('Orders');
    if (key === 'chats') return navigation.navigate('Cart');
    if (key === 'Profile') return navigation.navigate('Profile');
  };

  const handleProceedToPayment = () => {
    navigation.navigate('Payment');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Delivery */}
          <Text style={styles.sectionLabel}>Delivery</Text>
          <View style={styles.deliveryRow}>
            <View style={styles.addressBlock}>
              <Text style={styles.addressLine1}>{addressLine1}</Text>
              <Text style={styles.addressLine2}>{addressLine2}</Text>
            </View>
            <View style={styles.addressThumb}>
              <MaterialCommunityIcons name="home-city-outline" size={28} color={COLORS.primary} />
            </View>
          </View>

          {/* Order Summary */}
          <Text style={[styles.sectionLabel, { marginTop: SIZES.spacing.xl }]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIconBox}>
              <Ionicons name="time-outline" size={22} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.summaryTime}>{estimatedTime}</Text>
              <Text style={styles.summarySubtitle}>Estimated delivery time</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <PrimaryButton title="Proceed to Payment" onPress={handleProceedToPayment} />
      </View>

      <BottomTabBar active="Order" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.screenPadding,
    paddingTop: SIZES.spacing.sm,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: SIZES.spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SIZES.screenPadding,
  },
  sectionLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressBlock: {
    flex: 1,
    marginRight: SIZES.spacing.md,
  },
  addressLine1: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  addressLine2: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  addressThumb: {
    width: 64,
    height: 64,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.md,
  },
  summaryTime: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  summarySubtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: SIZES.spacing.md,
  },
});