import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const MAX_CONTENT_WIDTH = 430;

// ---- Static content -----------------------------------------------------
// TODO: replace with real data from your backend/API once available.
const RATING_BREAKDOWN = [
  { stars: 5, percent: 40 },
  { stars: 4, percent: 30 },
  { stars: 3, percent: 15 },
  { stars: 2, percent: 10 },
  { stars: 1, percent: 5 },
];

function RatingBar({ stars, percent }) {
  return (
    <View style={styles.ratingBarRow}>
      <Text style={styles.ratingBarLabel}>{stars}</Text>
      <View style={styles.ratingBarTrack}>
        <View style={[styles.ratingBarFill, { width: `${percent}%` }]} />
      </View>
      <Text style={styles.ratingBarPercent}>{percent}%</Text>
    </View>
  );
}

export default function ProductDetail({ navigation, route }) {
  const {
    id,
    name = 'Classic Cheeseburger',
    detailDescription = 'Juicy beef patty, melted cheddar, crisp lettuce, ripe tomato, and tangy pickles on a toasted sesame bun.',
    price = '$12.99',
    image,
  } = route.params || {};

  const { addItem } = useCart();
  const { isFavorited, toggleFavorite } = useFavorites();

  const [quantity, setQuantity] = useState(1);

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  // CartContext does price * quantity math, so it needs a plain number —
  // this strips the currency symbol/commas from strings like "$12.99".
  const numericPrice =
    typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;

  // Fallback id from the name so items without a real product id still
  // dedupe correctly in the cart/favorites instead of adding duplicate rows.
  const productId = id || name.toLowerCase().replace(/\s+/g, '-');

  const favorited = isFavorited(productId);

  // Bundles up everything downstream screens (Payment, CardPayment,
  // OrderTracking, Orders) need to know about this order.
  const buildOrderItem = () => ({
    name,
    description: detailDescription,
    price,
    quantity,
    image,
  });

  const handleAddToCart = () => {
    addItem(
      {
        id: productId,
        name,
        price: numericPrice,
        image,
      },
      quantity
    );
    navigation.navigate('Cart');
  };

  const handleOrderNow = () => {
    navigation.navigate('Payment', {
      orderItem: buildOrderItem(),
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: productId,
      name,
      price: numericPrice,
      image,
      description: detailDescription,
    });
  };

  const handleTabPress = (key) => {
    if (key === 'Home') {
      navigation.navigate('Home');
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
    if (key === 'Profile') {
      navigation.navigate('Profile');
      return;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Top row: back + favorite */}
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToggleFavorite} activeOpacity={0.7}>
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={24}
                color={favorited ? COLORS.primary : COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Hero image */}
          <View style={styles.heroWrapper}>
            <Image source={image} style={styles.heroImage} resizeMode="cover" />
          </View>

          {/* Title + description */}
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>{detailDescription}</Text>

          {/* Rating */}
          <View style={styles.ratingHeaderRow}>
            <Text style={styles.ratingNumber}>4.5</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4].map((i) => (
                <Ionicons key={i} name="star" size={16} color={COLORS.primary} />
              ))}
              <Ionicons name="star-half" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.reviewsText}>120 reviews</Text>
          </View>
          {RATING_BREAKDOWN.map((row) => (
            <RatingBar key={row.stars} stars={row.stars} percent={row.percent} />
          ))}

          {/* Price */}
          <Text style={styles.sectionLabel}>Price</Text>
          <Text style={styles.priceValue}>{price}</Text>

          {/* Quantity */}
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity style={styles.qtyButton} onPress={decreaseQty} activeOpacity={0.7}>
              <Text style={styles.qtyButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyButton} onPress={increaseQty} activeOpacity={0.7}>
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.orderNowButton}
            activeOpacity={0.85}
            onPress={handleOrderNow}
          >
            <Text style={styles.orderNowText}>Order Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addToCartButton}
            activeOpacity={0.85}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomTabBar active="Home" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingBottom: SIZES.spacing.lg },
  container: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SIZES.screenPadding,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.spacing.md,
  },
  heroWrapper: {
    width: '100%',
    height: 220,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    marginTop: SIZES.spacing.md,
    backgroundColor: COLORS.surface,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.h3,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.lg,
  },
  description: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacing.sm,
    lineHeight: 20,
  },
  ratingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spacing.lg,
  },
  ratingNumber: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h3,
    color: COLORS.textPrimary,
    marginRight: SIZES.spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: SIZES.spacing.sm,
  },
  reviewsText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spacing.xs,
  },
  ratingBarLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    width: 12,
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.spacing.sm,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  ratingBarPercent: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    width: 32,
    textAlign: 'right',
  },
  sectionLabel: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.lg,
  },
  priceValue: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h3,
    color: COLORS.primary,
    marginTop: SIZES.spacing.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spacing.sm,
  },
  qtyButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.h4,
    color: COLORS.primary,
  },
  qtyValue: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginHorizontal: SIZES.spacing.lg,
  },
  orderNowButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
    paddingVertical: SIZES.spacing.md,
    alignItems: 'center',
    marginTop: SIZES.spacing.xl,
  },
  orderNowText: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.white,
  },
  addToCartButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
    paddingVertical: SIZES.spacing.md,
    alignItems: 'center',
    marginTop: SIZES.spacing.sm,
  },
  addToCartText: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.primary,
  },
});