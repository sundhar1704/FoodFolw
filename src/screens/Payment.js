import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BackButton from '../components/BackButton';
import PrimaryButton from '../components/PrimaryButton';
import BottomTabBar from '../components/BottomTabBar';

const { width: windowWidth } = Dimensions.get('window');
const MAX_CONTENT_WIDTH = 430;

const METHODS = [
  {
    key: 'card',
    title: 'Card',
    subtitle: 'Add a new card',
    icon: 'credit-card-outline',
    iconBg: '#F3ECE1',
    iconColor: COLORS.textPrimary,
  },
  {
    key: 'upi',
    title: 'UPI',
    subtitle: 'Pay with UPI',
    icon: 'cellphone-nfc',
    iconBg: '#1F3D3B',
    iconColor: COLORS.white,
  },
  {
    key: 'cash',
    title: 'Cash on Delivery',
    subtitle: 'Pay with cash',
    icon: 'cash',
    iconBg: '#F6D9B8',
    iconColor: COLORS.textPrimary,
  },
];

export default function Payment({ navigation, route }) {
  const [selected, setSelected] = useState('card');

  // Passed in from ProductDetail's "Order Now" button. Carried through
  // to CardPayment / OrderTracking so those screens know what was
  // actually ordered instead of showing placeholder data.
  const { orderItem } = route?.params || {};

  const handlePayNow = () => {
    if (selected === 'card') {
      navigation.navigate('CardPayment', { orderItem });
    } else {
      // UPI / Cash on Delivery don't need a card form — go straight to
      // order tracking once wired up to real order placement logic.
      navigation.navigate('OrderTracking', { orderItem });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {METHODS.map((method) => {
            const isSelected = selected === method.key;
            return (
              <TouchableOpacity
                key={method.key}
                style={[styles.methodRow, isSelected && styles.methodRowSelected]}
                activeOpacity={0.8}
                onPress={() => setSelected(method.key)}
              >
                <View style={styles.methodText}>
                  {isSelected && <Text style={styles.selectedLabel}>Selected</Text>}
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                </View>

                <View style={[styles.iconBox, { backgroundColor: method.iconBg }]}>
                  <MaterialCommunityIcons
                    name={method.icon}
                    size={22}
                    color={method.iconColor}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <PrimaryButton title="Pay Now" onPress={handlePayNow} />
      </View>

      <BottomTabBar
        active="Order"
        onTabPress={() => {}}
      />
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
    fontFamily: FONT.semiBold,
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
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.md,
    marginBottom: SIZES.spacing.sm,
  },
  methodRowSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  methodText: {
    flex: 1,
  },
  selectedLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
  },
  methodTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  methodSubtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  iconBox: {
    width: 64,
    height: 44,
    borderRadius: SIZES.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: SIZES.spacing.md,
  },
});