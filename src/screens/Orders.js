import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';

// TODO: swap these placeholders for real dish photos once available —
// same pattern as the rest of the app (assets/image/*.png).
import placeholderImg from '../../assets/image/image1.png';

const MAX_CONTENT_WIDTH = 430;

// TODO: replace with real order history from backend/API once available.
const DEFAULT_ACTIVE_ORDERS = [
  {
    id: 'a1',
    name: 'Pizza Palace',
    description: 'margherita pizza, caesar salad',
    date: 'Today 2:30 PM',
    price: '$21.98',
    eta: '15 min',
    image: placeholderImg,
  },
  {
    id: 'a2',
    name: 'Burger House',
    description: 'Classic Burger, fries, cola',
    date: 'Today 1:45 PM',
    price: '$18.50',
    eta: '15 min',
    image: require('../../assets/image/Frame 3273.jpg'),
  },
];

const PAST_ORDERS = [
  {
    id: 'p1',
    name: 'Sushi compo',
    description: 'Sushi, rolls, Moraco salad',
    date: 'Nov 12, 1:45 PM',
    price: '$21.98',
    image: placeholderImg,
  },
  {
    id: 'p2',
    name: 'Veg Bowl',
    description: 'Quinoa bowl, Green smoothie',
    date: 'Nov 12, 1:45 PM',
    price: '$18.50',
    image: placeholderImg,
  },
];

function ActiveOrderCard({ order, onTrack }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Image source={order.image} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardInfo}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{order.name}</Text>
            <Text style={styles.cardPrice}>{order.price}</Text>
          </View>
          <Text style={styles.cardDescription} numberOfLines={1}>{order.description}</Text>
          <Text style={styles.cardDate}>{order.date}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottomRow}>
        <View style={styles.statusLeft}>
          <MaterialCommunityIcons name="truck-fast-outline" size={16} color={COLORS.primary} />
          <Text style={styles.statusText}>On the way</Text>
          <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} style={styles.etaIcon} />
          <Text style={styles.etaText}>{order.eta}</Text>
        </View>
        <TouchableOpacity onPress={() => onTrack(order)} activeOpacity={0.7}>
          <Text style={styles.actionLink}>Track</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PastOrderCard({ order, onReorder }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Image source={order.image} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardInfo}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{order.name}</Text>
            <Text style={styles.cardPrice}>{order.price}</Text>
          </View>
          <Text style={styles.cardDescription} numberOfLines={1}>{order.description}</Text>
          <Text style={styles.cardDate}>{order.date}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottomRow}>
        <View style={styles.statusLeft}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success || '#2E9E5B'} />
          <Text style={[styles.statusText, { color: COLORS.success || '#2E9E5B' }]}>Delivered</Text>
        </View>
        <TouchableOpacity onPress={() => onReorder(order)} activeOpacity={0.7}>
          <Text style={styles.actionLink}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Orders({ navigation, route }) {
  const [tab, setTab] = useState('active'); // 'active' | 'past'
  const [activeOrders, setActiveOrders] = useState(DEFAULT_ACTIVE_ORDERS);

  // Tracks which newOrder we've already merged in, so navigating back to
  // this screen again with the same params doesn't duplicate the card.
  const mergedOrderId = useRef(null);

  useEffect(() => {
    const incoming = route?.params?.newOrder;
    if (incoming && incoming.id !== mergedOrderId.current) {
      mergedOrderId.current = incoming.id;
      setActiveOrders((prev) => [incoming, ...prev]);
      setTab('active');
    }
  }, [route?.params?.newOrder]);

  const handleTrack = (order) => {
    navigation.navigate('OrderTracking', { orderItem: order });
  };

  const handleReorder = (order) => {
    // TODO: wire into CartContext / re-run checkout flow once available.
    navigation.navigate('ProductDetail', {
      name: order.name,
      detailDescription: order.description,
      price: order.price,
      image: order.image,
    });
  };

  const handleTabPress = (key) => {
    if (key === 'Order') return; // already here
    if (key === 'Home') navigation.navigate('Home');
    if (key === 'chats') navigation.navigate('EmptyCart');
    if (key === 'Profile') navigation.navigate('Profile');
  };

  const data = tab === 'active' ? activeOrders : PAST_ORDERS;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Orders</Text>
          <Text style={styles.headerSubtitle}>Track your orders</Text>

          <View style={styles.tabSwitch}>
            <TouchableOpacity
              style={[styles.tabButton, tab === 'active' && styles.tabButtonActive]}
              activeOpacity={0.8}
              onPress={() => setTab('active')}
            >
              <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>
                Active({activeOrders.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, tab === 'past' && styles.tabButtonActive]}
              activeOpacity={0.8}
              onPress={() => setTab('past')}
            >
              <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>
                Past({PAST_ORDERS.length})
              </Text>
            </TouchableOpacity>
          </View>

          {data.map((order) =>
            tab === 'active' ? (
              <ActiveOrderCard key={order.id} order={order} onTrack={handleTrack} />
            ) : (
              <PastOrderCard key={order.id} order={order} onReorder={handleReorder} />
            )
          )}
        </View>
      </ScrollView>

      <BottomTabBar active="Order" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { alignItems: 'center', paddingBottom: SIZES.spacing.lg },
  container: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SIZES.screenPadding,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h2,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.md,
  },
  headerSubtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SIZES.spacing.lg,
  },
  tabSwitch: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: SIZES.radiusPill,
    padding: 4,
    marginBottom: SIZES.spacing.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: SIZES.radiusPill,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontFamily: FONT.semiBold,
  },
  card: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.spacing.md,
    marginBottom: SIZES.spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.surface,
    marginRight: SIZES.spacing.md,
  },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SIZES.spacing.sm,
  },
  cardPrice: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  cardDescription: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardDate: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SIZES.spacing.sm,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.caption,
    color: COLORS.primary,
    marginLeft: 4,
  },
  etaIcon: { marginLeft: 10 },
  etaText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  actionLink: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.caption,
    color: COLORS.primary,
  },
});