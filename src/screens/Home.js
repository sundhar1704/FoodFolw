import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import { clearLoggedIn } from '../utils/authStorage';

const { width: windowWidth } = Dimensions.get('window');
const MAX_CONTENT_WIDTH = 430;

// ---- Static content -----------------------------------------------------
// TODO: replace with real data from your backend/API once available.

const CATEGORIES = [
  { key: 'all', icon: 'flame', lib: 'Ionicons' },
  { key: 'pizza', icon: 'pizza', lib: 'MaterialCommunityIcons' },
  { key: 'burger', icon: 'hamburger', lib: 'MaterialCommunityIcons' },
  { key: 'bowl', icon: 'basket-outline', lib: 'Ionicons' },
  { key: 'dessert', icon: 'ice-cream', lib: 'MaterialCommunityIcons' },
];

const POPULAR_ITEMS = [
  {
    id: '1',
    name: 'Margherita pizza',
    description: 'fresh mozzarella,tomato sauce, besil',
    price: '$12.99',
    category: 'pizza',
    image: require('../../assets/image/image1.png'),
  },
  {
    id: '2',
    name: 'Sushi compo',
    description: 'Assorted fresh sushi rools',
    price: '$24.99',
    category: 'bowl',
    image: require('../../assets/image/image2.png'),
  },
  {
    id: '3',
    name: 'Classic Burgur',
    description: 'Beef patty, cheese,lettuse,tomato',
    price: '$10.99',
    category: 'burger',
    // TODO: this is still pointing at the sushi image (Frame 134.jpg) as a
    // placeholder duplicate — swap in the real burger file once confirmed.
    image: require('../../assets/image/image3.png'),
  },
];

// TODO: once a real backend exists, this should come from the "current
// promotions" endpoint instead of being hardcoded to the first item.
const DEAL_ITEM = POPULAR_ITEMS[0];

function CategoryIcon({ item, active }) {
  const IconComponent = item.lib === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
  return (
    <View style={[styles.categoryChip, active && styles.categoryChipActive]}>
      <IconComponent
        name={item.icon}
        size={20}
        color={active ? COLORS.white : COLORS.textPrimary}
      />
    </View>
  );
}

function PopularItemCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.itemCard} activeOpacity={0.85} onPress={onPress}>
      <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Home({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('all');

  // TEMPORARY dev helper: since Home is now reached via a persisted login
  // flag, there's no UI yet to log out and see Splash/Onboarding/Login again.
  // Tapping "Profile" clears that flag so you can retest the full flow.
  // Replace this with real Profile screen navigation once it's built.
  const handleProfileTap = () => {
    Alert.alert(
      'Profile screen coming soon',
      'For now, tapping here logs you out (dev only) so you can retest the Splash → Onboarding → Login flow. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await clearLoggedIn();
            navigation.replace('Splash');
          },
        },
      ]
    );
  };

  const handleTabPress = (key) => {
    if (key === 'Home') return; // already here
    if (key === 'Profile') {
      navigation.navigate('Profile');
      return;
    }
    if (key === 'Order') {
      navigation.navigate('Orders');
      return;
    }
    if (key === 'chats') {
      navigation.navigate('Cart');
      return;
    }
  };

  const handleItemPress = (item) => {
    navigation.navigate('ProductDetail', {
      id: item.id,
      name: item.name,
      detailDescription: item.description,
      price: item.price,
      image: item.image,
    });
  };

  // "Order Now" on the special-offer banner takes the user straight into
  // the deal item's product page, same as tapping its card would.
  const handleOrderNowPress = () => {
    handleItemPress(DEAL_ITEM);
  };

  const filteredItems =
    activeCategory === 'all'
      ? POPULAR_ITEMS
      : POPULAR_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Deliver to */}
          <View style={styles.deliverRow}>
            <Ionicons name="location-sharp" size={16} color={COLORS.primary} />
            <View style={{ marginLeft: 4 }}>
              <Text style={styles.deliverLabel}>Deliver to</Text>
              <Text style={styles.deliverAddress}>Home in 123-Main st</Text>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={COLORS.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants for cuisines"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          {/* Special offer banner */}
          <View style={styles.offerBanner}>
            <Text style={styles.offerLabel}>Special offer</Text>
            <Text style={styles.offerTitle}>Get 50% OFF</Text>
            <Text style={styles.offerSubtitle}>
              only your first order above <Text style={{ fontFamily: FONT.semiBold }}>$20</Text>
            </Text>
            <TouchableOpacity
              style={styles.offerButton}
              activeOpacity={0.8}
              onPress={handleOrderNowPress}
            >
              <Text style={styles.offerButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.8}
                onPress={() => setActiveCategory(item.key)}
              >
                <CategoryIcon item={item} active={activeCategory === item.key} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Popular Items */}
          <Text style={styles.sectionTitle}>Papular Items</Text>
          {filteredItems.length === 0 ? (
            <Text style={styles.emptyText}>No items in this category yet.</Text>
          ) : (
            filteredItems.map((item) => (
              <PopularItemCard
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <BottomTabBar active="Home" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
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
  deliverRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SIZES.spacing.md,
  },
  deliverLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
  },
  deliverAddress: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    height: 48,
    paddingHorizontal: SIZES.spacing.md,
    marginTop: SIZES.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.spacing.sm,
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textPrimary,
  },
  offerBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.spacing.lg,
    marginTop: SIZES.spacing.lg,
  },
  offerLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: 'rgba(255,255,255,0.9)',
  },
  offerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h2,
    color: COLORS.white,
    marginTop: 4,
  },
  offerSubtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  offerButton: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusPill,
    alignSelf: 'flex-start',
    paddingVertical: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.lg,
    marginTop: SIZES.spacing.md,
  },
  offerButtonText: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.bodySmall,
    color: COLORS.primary,
  },
  sectionTitle: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingBottom: SIZES.spacing.xs,
  },
  categoryChip: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  itemCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    marginBottom: SIZES.spacing.md,
  },
  itemImage: {
    width: '100%',
    height: 170,
  },
  itemInfo: {
    padding: SIZES.spacing.md,
  },
  itemName: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  itemDescription: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.primary,
    marginTop: SIZES.spacing.xs,
  },
  emptyText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.spacing.lg,
  },
});