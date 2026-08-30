import React from 'react';
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
import BackButton from '../components/BackButton';
import PrimaryButton from '../components/PrimaryButton';
import { useCart } from '../context/CartContext';

const MAX_CONTENT_WIDTH = 430;

function CartRow({ item, onDecrease, onIncrease }) {
    return (
        <View style={styles.itemRow}>
            <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.quantity}</Text>
            </View>
            <View style={styles.stepper}>
                <TouchableOpacity style={styles.stepperButton} onPress={onDecrease} activeOpacity={0.7}>
                    <Text style={styles.stepperButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{item.quantity}</Text>
                <TouchableOpacity style={styles.stepperButton} onPress={onIncrease} activeOpacity={0.7}>
                    <Text style={styles.stepperButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function Cart({ navigation }) {
    const { items, updateQuantity } = useCart();

    const handleTabPress = (key) => {
        if (key === 'chats') return; // already here
        if (key === 'Home') return navigation.navigate('Home');
        if (key === 'Order') return navigation.navigate('Orders');
        if (key === 'Profile') return navigation.navigate('Profile');
    };

    const handleCheckout = () => {
        navigation.navigate('Checkout');
    };

    const isEmpty = items.length === 0;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                {navigation.canGoBack() && (
                    <BackButton onPress={() => navigation.goBack()} />
                )}
                <Text style={styles.headerTitle}>Cart</Text>
                <View style={{ width: 36 }} />
            </View>

            {isEmpty ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="bag-outline" size={64} color={COLORS.textPrimary} />
                    <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Add items from a restaurants to{'\n'}start ordering
                    </Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        {items.map((item) => (
                            <CartRow
                                key={item.id}
                                item={item}
                                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}

            {!isEmpty && (
                <View style={styles.buttonWrapper}>
                    <PrimaryButton title="Checkout" onPress={handleCheckout} />
                </View>
            )}

            <BottomTabBar active="chats" onTabPress={handleTabPress} />
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
    itemInfo: {
        flex: 1,
        marginLeft: SIZES.spacing.md,
    },
    itemName: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.body,
        color: COLORS.textPrimary,
    },
    itemQty: {
        fontFamily: FONT.medium,
        fontSize: SIZES.bodySmall,
        color: COLORS.primary,
        marginTop: 2,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepperButton: {
        width: 32,
        height: 32,
        borderRadius: SIZES.radiusSm,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperButtonText: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.body,
        color: COLORS.primary,
    },
    stepperValue: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.body,
        color: COLORS.textPrimary,
        marginHorizontal: SIZES.spacing.sm,
    },
    buttonWrapper: {
        width: '100%',
        maxWidth: MAX_CONTENT_WIDTH,
        alignSelf: 'center',
        paddingHorizontal: SIZES.screenPadding,
        paddingBottom: SIZES.spacing.md,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SIZES.screenPadding,
    },
    emptyTitle: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.h3,
        color: COLORS.textPrimary,
        marginTop: SIZES.spacing.lg,
        marginBottom: SIZES.spacing.sm,
    },
    emptySubtitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.bodySmall,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});