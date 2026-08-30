import React from 'react';
import { View, Text, TouchableOpacity, Linking, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BackButton from '../components/BackButton';
import BottomTabBar from '../components/BottomTabBar';

// TODO: swap this for the live Google Static Maps API once you have a key —
// see the STATIC_MAP_URL approach; just replace this import + the
// Image `source` prop below, nothing else needs to change.
import MapPlaceholder from '../../assets/image/image.png';

const MAX_CONTENT_WIDTH = 430;

const STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: 'check', type: 'done' },
  { key: 'preparing', label: 'Preparing', icon: 'silverware-fork-knife', type: 'active' },
  { key: 'onway', label: 'On the Way', icon: 'truck-fast-outline', type: 'pending' },
  { key: 'delivered', label: 'Delivered', icon: 'check', type: 'pending' },
];
// TODO: drive this from real order status once backend exists.
const CURRENT_STEP_INDEX = 1; // 'Preparing' — matches checkmark/utensil/truck/check pattern shown

export default function OrderTracking({ navigation, route }) {
  const { orderItem } = route?.params || {};

  const handleCall = () => {
    // TODO: replace with the real delivery partner's number.
    Linking.openURL('tel:+10000000000');
  };

  const handleTabPress = (key) => {
    if (key === 'Order') return; // already here
    if (key === 'Home') navigation.navigate('Home');
    if (key === 'chats') navigation.navigate('EmptyCart');
    if (key === 'Profile') navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <Image source={MapPlaceholder} style={styles.mapImage} resizeMode="cover" />

        <View style={styles.stepsWrapper}>
          {STEPS.map((step, index) => {
            const showCheck = index === 0 || index === STEPS.length - 1 || index < CURRENT_STEP_INDEX;
            const isLast = index === STEPS.length - 1;
            return (
              <View key={step.key} style={styles.stepRow}>
                <View style={styles.stepIconColumn}>
                  <View style={styles.stepDot}>
                    {showCheck ? (
                      <Ionicons name="checkmark" size={14} color={COLORS.textPrimary} />
                    ) : (
                      <MaterialCommunityIcons
                        name={step.icon === 'check' ? 'check' : step.icon}
                        size={14}
                        color={COLORS.textPrimary}
                      />
                    )}
                  </View>
                  {!isLast && <View style={styles.stepLine} />}
                </View>
                <Text style={styles.stepText}>{step.label}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Delivery Partner</Text>
        <Text style={styles.etaText}>Estimated arrival: 15-20 minutes</Text>

        <TouchableOpacity style={styles.callButton} activeOpacity={0.8} onPress={handleCall}>
          <Text style={styles.callButtonText}>Call</Text>
          <Ionicons name="call" size={14} color={COLORS.primary} style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.contactButton} activeOpacity={0.85} onPress={handleCall}>
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewOrderButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Orders', { orderItem })}
          >
            <Text style={styles.viewOrderButtonText}>View Order</Text>
          </TouchableOpacity>
        </View>
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
  mapImage: {
    width: '100%',
    height: 160,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.spacing.lg,
    backgroundColor: COLORS.surfaceAlt,
  },
  stepsWrapper: { marginBottom: SIZES.spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start' },
  stepIconColumn: { alignItems: 'center', marginRight: SIZES.spacing.sm },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: { width: 2, height: 22, backgroundColor: COLORS.textPrimary, marginVertical: 2 },
  stepText: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.bodySmall,
    color: COLORS.textPrimary,
    marginTop: 2,
    marginBottom: 10,
  },
  sectionLabel: { fontFamily: FONT.semiBold, fontSize: SIZES.body, color: COLORS.textPrimary },
  etaText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SIZES.spacing.md,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFE3CC',
    borderRadius: SIZES.radiusPill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: SIZES.spacing.xl,
  },
  callButtonText: { fontFamily: FONT.semiBold, fontSize: SIZES.bodySmall, color: COLORS.primary },
  footerRow: { flexDirection: 'row', gap: SIZES.spacing.md, marginBottom: SIZES.spacing.md },
  contactButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
    paddingVertical: SIZES.spacing.md,
    alignItems: 'center',
  },
  contactButtonText: { fontFamily: FONT.semiBold, fontSize: SIZES.body, color: COLORS.white },
  viewOrderButton: {
    flex: 1,
    backgroundColor: '#FFE3CC',
    borderRadius: SIZES.radiusPill,
    paddingVertical: SIZES.spacing.md,
    alignItems: 'center',
  },
  viewOrderButtonText: { fontFamily: FONT.semiBold, fontSize: SIZES.body, color: COLORS.primary },
});