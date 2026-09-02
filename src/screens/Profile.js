import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Linking,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import { clearLoggedIn } from '../utils/authStorage';

const MAX_CONTENT_WIDTH = 430;

// ---- Static content -----------------------------------------------------
// TODO: replace with real data from your backend/API once available.

const USER = {
    name: 'Jeon',
    email: 'Jeon912@gmail.com',
    badge: 'Premium Member',
    stats: { orders: 24, favorites: 12, sent: 420 },
};

const ORDER_ROWS = [
    { id: 'o1', name: 'Pizza Palace', orderId: '#ORD-2045', date: 'Today 2:45PM', price: '$22.98', status: 'Deliverd' },
    { id: 'o2', name: 'Burger Palace', orderId: '#ORD-2045', date: 'Today 1:00PM', price: '$28.98', status: 'Deliverd' },
    { id: 'o3', name: 'Sushi compo', orderId: '#ORD-2045', date: 'Today 3:45PM', price: '$30.98', status: 'Deliverd' },
];

const ADDRESS_ROWS = [
    { id: 'ad1', label: 'Home', badge: 'Default', address: '123 Main street,43B Apt,New york' },
    { id: 'ad2', label: 'Work', address: '463 office 23th floor,New york' },
    { id: 'ad3', label: 'Other', address: '786, park Avenue,New york' },
];

const PAYMENT_ROWS = [
    { id: 'pay1', label: 'Visa.....1234', badge: 'Default' },
    { id: 'pay2', label: 'Mastercard..888', badge: 'Default' },
];

const ACCOUNT_ITEMS = [
    { id: 'personal', icon: 'person-outline', title: 'Personal info', subtitle: 'Edit your personal information' },
    { id: 'notifications', icon: 'notifications-outline', title: 'Notificatons', subtitle: 'Mange Notifications settings' },
    { id: 'favorites', icon: 'heart-outline', title: 'Favorites', subtitle: 'view your favorite restaurants' },
];

const SUPPORT_ITEMS = [
    { id: 'help', icon: 'help-circle-outline', title: 'Help center', subtitle: 'Get help& support' },
    { id: 'settings', icon: 'settings-outline', title: 'Settings', subtitle: 'App preference and settings' },
];

function OrderRow({ item }) {
    return (
        <View style={styles.rowCard}>
            <View style={styles.rowIconCircle}>
                <MaterialCommunityIcons name="package-variant-closed" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <Text style={styles.rowSubtitle}>{item.orderId}   {item.date}</Text>
            </View>
            <View style={styles.rowRight}>
                <Text style={styles.rowPrice}>{item.price}</Text>
                <Text style={styles.rowStatus}>{item.status}</Text>
            </View>
        </View>
    );
}

function AddressRow({ item }) {
    return (
        <View style={styles.rowCard}>
            <View style={styles.rowInfo}>
                <View style={styles.addressLabelRow}>
                    <Text style={styles.rowTitle}>{item.label}</Text>
                    {item.badge && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>{item.badge}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.rowSubtitle}>{item.address}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
        </View>
    );
}

function PaymentRow({ item }) {
    return (
        <View style={styles.rowCard}>
            <View style={styles.rowInfo}>
                <View style={styles.addressLabelRow}>
                    <Text style={styles.rowTitle}>{item.label}</Text>
                    {item.badge && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>{item.badge}</Text>
                        </View>
                    )}
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
        </View>
    );
}

function SectionItem({ item, onPress }) {
    return (
        <TouchableOpacity style={styles.sectionItem} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.sectionIconCircle}>
                <Ionicons name={item.icon} size={20} color={COLORS.primary} />
            </View>
            <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function Profile({ navigation }) {
    const [tab, setTab] = useState('orders'); // 'orders' | 'addresses' | 'payments'

    const handleTabPress = (key) => {
        if (key === 'Profile') return; // already here
        if (key === 'Home') {
            navigation.navigate('Home');
            return;
        }
        if (key === 'Order') {
            navigation.navigate('Orders');
            return;
        }
        if (key === 'chats') {
            navigation.navigate('EmptyCart');
            return;
        }
    };

    const handleLogout = () => {
        const doLogout = async () => {
            await clearLoggedIn();
            navigation.replace('Splash');
        };

        // Alert.alert's button callbacks don't fire reliably on web builds
        // (react-native-web has no native Alert UI), so branch on platform.
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to log out?')) {
                doLogout();
            }
        } else {
            Alert.alert('Log out', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: doLogout },
            ]);
        }
    };

    const handleAccountPress = (id) => {
        if (id === 'personal') {
            // navigation.navigate('PersonalInfo') once that screen exists
            Alert.alert('Personal info', 'Coming soon.');
        }
        if (id === 'notifications') {
            // navigation.navigate('Notifications') once that screen exists
            Alert.alert('Notifications', 'Coming soon.');
        }
        if (id === 'favorites') {
            navigation.navigate('Favorites');
        }
    };

    const handleSupportPress = (id) => {
        if (id === 'help') {
            Linking.openURL('mailto:support@foodflow.app?subject=Help%20Request');
        }
        if (id === 'settings') {
            // navigation.navigate('Settings') once that screen exists
            Alert.alert('Settings', 'Coming soon.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Orange header banner */}
                <View style={styles.headerBanner}>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Profile</Text>
                        <Text style={styles.headerSubtitle}>Manage Your Account</Text>
                    </View>
                </View>

                <View style={styles.container}>
                    {/* User card */}
                    <View style={styles.userCard}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="person-outline" size={32} color={COLORS.textSecondary} />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{USER.name}</Text>
                            <Text style={styles.userEmail}>{USER.email}</Text>
                        </View>
                        <View style={styles.premiumBadge}>
                            <Text style={styles.premiumBadgeText}>{USER.badge}</Text>
                        </View>
                    </View>

                    {/* Stats row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{USER.stats.orders}</Text>
                            <Text style={styles.statLabel}>Orders</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{USER.stats.favorites}</Text>
                            <Text style={styles.statLabel}>Favorites</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{USER.stats.sent}</Text>
                            <Text style={styles.statLabel}>Sent</Text>
                        </View>
                    </View>

                    {/* Sub-tabs */}
                    <View style={styles.tabToggle}>
                        <TouchableOpacity
                            style={[styles.tabPill, tab === 'orders' && styles.tabPillActive]}
                            activeOpacity={0.8}
                            onPress={() => setTab('orders')}
                        >
                            <Text style={[styles.tabPillText, tab === 'orders' && styles.tabPillTextActive]}>
                                Orders
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabPill, tab === 'addresses' && styles.tabPillActive]}
                            activeOpacity={0.8}
                            onPress={() => setTab('addresses')}
                        >
                            <Text style={[styles.tabPillText, tab === 'addresses' && styles.tabPillTextActive]}>
                                Addresses
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabPill, tab === 'payments' && styles.tabPillActive]}
                            activeOpacity={0.8}
                            onPress={() => setTab('payments')}
                        >
                            <Text style={[styles.tabPillText, tab === 'payments' && styles.tabPillTextActive]}>
                                Payments
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sub-tab content */}
                    {tab === 'orders' && ORDER_ROWS.map((item) => <OrderRow key={item.id} item={item} />)}
                    {tab === 'addresses' && ADDRESS_ROWS.map((item) => <AddressRow key={item.id} item={item} />)}
                    {tab === 'payments' && PAYMENT_ROWS.map((item) => <PaymentRow key={item.id} item={item} />)}

                    {/* ACCOUNT section */}
                    <Text style={styles.sectionHeading}>ACCOUNT</Text>
                    {ACCOUNT_ITEMS.map((item) => (
                        <SectionItem key={item.id} item={item} onPress={() => handleAccountPress(item.id)} />
                    ))}

                    {/* SUPPORT section */}
                    <Text style={styles.sectionHeading}>SUPPORT</Text>
                    {SUPPORT_ITEMS.map((item) => (
                        <SectionItem key={item.id} item={item} onPress={() => handleSupportPress(item.id)} />
                    ))}

                    {/* Logout */}
                    <TouchableOpacity style={styles.logoutRow} activeOpacity={0.7} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color={COLORS.danger || '#E53935'} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomTabBar active="Profile" onTabPress={handleTabPress} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    scroll: { flex: 1 },
    scrollContent: { alignItems: 'center', paddingBottom: SIZES.spacing.lg },
    headerBanner: {
        width: '100%',
        backgroundColor: COLORS.primary,
        paddingTop: SIZES.spacing.lg,
        paddingBottom: SIZES.spacing.xl + 24, // extra so the user card can overlap it
        alignItems: 'center',
    },
    headerContent: {
        width: '100%',
        maxWidth: MAX_CONTENT_WIDTH,
        paddingHorizontal: SIZES.screenPadding,
    },
    headerTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.h2,
        color: COLORS.white,
    },
    headerSubtitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.bodySmall,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 2,
    },
    container: {
        width: '100%',
        maxWidth: MAX_CONTENT_WIDTH,
        paddingHorizontal: SIZES.screenPadding,
        marginTop: -48, // pulls the user card up to overlap the orange banner
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.spacing.md,
        shadowColor: COLORS.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    avatarCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userInfo: {
        flex: 1,
        marginLeft: SIZES.spacing.md,
    },
    userName: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.body,
        color: COLORS.textPrimary,
    },
    userEmail: {
        fontFamily: FONT.regular,
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    premiumBadge: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: SIZES.radiusPill,
        paddingVertical: 4,
        paddingHorizontal: SIZES.spacing.sm,
    },
    premiumBadgeText: {
        fontFamily: FONT.medium,
        fontSize: 10,
        color: COLORS.primary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: SIZES.spacing.lg,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontFamily: FONT.bold,
        fontSize: SIZES.h4,
        color: COLORS.textPrimary,
    },
    statLabel: {
        fontFamily: FONT.regular,
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    tabToggle: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusPill,
        padding: 4,
        marginTop: SIZES.spacing.lg,
        marginBottom: SIZES.spacing.md,
    },
    tabPill: {
        flex: 1,
        borderRadius: SIZES.radiusPill,
        paddingVertical: SIZES.spacing.sm,
        alignItems: 'center',
    },
    tabPillActive: { backgroundColor: COLORS.white },
    tabPillText: {
        fontFamily: FONT.medium,
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
    },
    tabPillTextActive: { color: COLORS.textPrimary },
    rowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surfaceAlt,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.spacing.md,
        marginBottom: SIZES.spacing.sm,
    },
    rowIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.spacing.md,
    },
    rowInfo: {
        flex: 1,
    },
    rowTitle: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.bodySmall,
        color: COLORS.textPrimary,
    },
    rowSubtitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    rowRight: {
        alignItems: 'flex-end',
    },
    rowPrice: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.bodySmall,
        color: COLORS.textPrimary,
    },
    rowStatus: {
        fontFamily: FONT.medium,
        fontSize: SIZES.caption,
        color: COLORS.success,
        marginTop: 2,
    },
    addressLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    defaultBadge: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: SIZES.radiusPill,
        paddingVertical: 2,
        paddingHorizontal: SIZES.spacing.sm,
        marginLeft: SIZES.spacing.sm,
    },
    defaultBadgeText: {
        fontFamily: FONT.medium,
        fontSize: 10,
        color: COLORS.primary,
    },
    editText: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.caption,
        color: COLORS.primary,
    },
    sectionHeading: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.caption,
        color: COLORS.textTertiary,
        letterSpacing: 0.5,
        marginTop: SIZES.spacing.lg,
        marginBottom: SIZES.spacing.sm,
    },
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.spacing.md,
    },
    sectionIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.spacing.md,
    },
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZES.spacing.md,
        marginBottom: SIZES.spacing.lg,
    },
    logoutText: {
        fontFamily: FONT.semiBold,
        fontSize: SIZES.body,
        color: '#E53935',
        marginLeft: SIZES.spacing.sm,
    },
});