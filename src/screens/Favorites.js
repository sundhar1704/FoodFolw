import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BackButton from '../components/BackButton';
import BottomTabBar from '../components/BottomTabBar';
import { useFavorites } from '../context/FavoritesContext';

const MAX_CONTENT_WIDTH = 430;

export default function Favorites({ navigation }) {
  const { items, removeFavorite } = useFavorites();

  const handleTabPress = (key) => {
    if (key === 'Home') return navigation.navigate('Home');
    if (key === 'Order') return navigation.navigate('Orders');
    if (key === 'chats') return navigation.navigate('Cart');
    if (key === 'Profile') return navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={{ width: 36 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={COLORS.textPrimary} />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any item to save it here
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemRow}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    name: item.name,
                    detailDescription: item.description,
                    price: `$${item.price.toFixed(2)}`,
                    image: item.image,
                  })
                }
              >
                <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFavorite(item.id)} hitSlop={10}>
                  <Ionicons name="heart" size={22} color={COLORS.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <BottomTabBar active="Profile" onTabPress={handleTabPress} />
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
    paddingTop: SIZES.spacing.sm,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
  },
  scrollContent: { alignItems: 'center', paddingBottom: SIZES.spacing.lg },
  container: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SIZES.screenPadding,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spacing.lg,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.surface,
  },
  itemInfo: { flex: 1, marginLeft: SIZES.spacing.md },
  itemName: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  itemPrice: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.bodySmall,
    color: COLORS.primary,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.screenPadding,
  },
  emptyTitle: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});