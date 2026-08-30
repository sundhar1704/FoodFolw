import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';

// TODO: swap this for a real success illustration/animation once you have
// one — same placeholder pattern used for the map on OrderTracking.
import SuccessImage from '../../assets/image/image5.png';

const MAX_CONTENT_WIDTH = 430;

export default function PaymentSuccessful({ navigation, route }) {
  const { orderItem } = route?.params || {};

  // TODO: replace with the real order id returned by the backend once
  // order placement is wired up to an API.
  const orderId = orderItem?.orderId || String(Date.now()).slice(0, 10);

  const handleTrackOrder = () => {
    navigation.navigate('OrderTracking', { orderItem: { ...orderItem, orderId } });
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handleTabPress = (key) => {
    if (key === 'Order') {
      navigation.navigate('Orders');
      return;
    }
    if (key === 'Home') navigation.navigate('Home');
    if (key === 'chats') navigation.navigate('EmptyCart');
    if (key === 'Profile') navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Successful</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <Image source={SuccessImage} style={styles.heroImage} resizeMode="cover" />

        <Text style={styles.title}>Order Placed Successfully</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully. You can track your order status in the app.
        </Text>

        <Text style={styles.orderIdLabel}>Order ID</Text>
        <Text style={styles.orderIdValue}>{orderId}</Text>

        <TouchableOpacity
          style={styles.trackButton}
          activeOpacity={0.85}
          onPress={handleTrackOrder}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          activeOpacity={0.85}
          onPress={handleBackToHome}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      <BottomTabBar active="Order" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.spacing.md,
  },
  headerTitle: { fontFamily: FONT.semiBold, fontSize: SIZES.h4, color: COLORS.textPrimary },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: SIZES.screenPadding,
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: SIZES.radiusMd,
    marginTop: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
    backgroundColor: COLORS.surfaceAlt,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.spacing.sm,
    lineHeight: 20,
  },
  orderIdLabel: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.bodySmall,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.xl,
  },
  orderIdValue: {
    fontFamily: FONT.regular,
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  trackButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
    paddingVertical: SIZES.spacing.md,
    alignItems: 'center',
    marginTop: SIZES.spacing.xl,
  },
  trackButtonText: { fontFamily: FONT.semiBold, fontSize: SIZES.body, color: COLORS.white },
  homeButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
    paddingVertical: SIZES.spacing.md,
    alignItems: 'center',
    marginTop: SIZES.spacing.sm,
  },
  homeButtonText: { fontFamily: FONT.semiBold, fontSize: SIZES.body, color: COLORS.primary },
});