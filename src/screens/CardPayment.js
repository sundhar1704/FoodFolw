import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from '../constants/theme';
import BackButton from '../components/BackButton';

const MAX_CONTENT_WIDTH = 430;

// TODO: replace with real cart total once available from CartContext.
const ORDER_SUMMARY = { itemTotal: 25.0, deliveryFee: 2.99, taxes: 1.5 };
const TOTAL_AMOUNT = ORDER_SUMMARY.itemTotal + ORDER_SUMMARY.deliveryFee + ORDER_SUMMARY.taxes;

// Auto-inserts "/" after the 2nd digit as the user types, e.g. "12" -> "12/"
// then "12/2" -> "12/2" -> "12/21". Also strips any non-digit characters
// and caps at 4 digits (MMYY) so the field can never exceed "MM/YY".
function formatExpiry(text) {
  const digitsOnly = text.replace(/\D/g, '').slice(0, 4);
  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }
  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
}

export default function CardPayment({ navigation, route }) {
  const [cardNumber, setCardNumber] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading'

  // NOTE: React Native's Alert.alert() does not render any UI on web
  // (Expo Web / react-native-web), so validation errors used to fail
  // silently there. Using inline error text instead works identically
  // on web and native.
  const [errors, setErrors] = useState({});

  // Forwarded from Payment.js, originally built in ProductDetail.js.
  const { orderItem } = route?.params || {};

  const last4 = cardNumber.replace(/\s/g, '').slice(-4);

  const handleExpiryChange = (text) => {
    setExpiry(formatExpiry(text));
  };

  const validate = () => {
    const digits = cardNumber.replace(/\s/g, '');
    const nextErrors = {};

    if (digits.length < 12) {
      nextErrors.cardNumber = 'Enter a valid card number (at least 12 digits).';
    }
    if (!nameOnCard.trim()) {
      nextErrors.nameOnCard = 'Enter the name on the card.';
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      nextErrors.expiry = 'Use MM/YY format.';
    }
    if (cvv.length < 3) {
      nextErrors.cvv = 'Enter a valid CVV.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;

    setStatus('loading');
    // TODO: replace with real payment gateway call once integrated.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus('idle');

    navigation.navigate('PaymentSuccess', { orderItem });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Card Payment</Text>
        <Feather name="lock" size={18} color={COLORS.textSecondary} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.cardPreviewRow}>
            <View>
              <Text style={styles.label}>Card</Text>
              <Text style={styles.cardMasked}>.... {last4 || '0000'}</Text>
            </View>
            <View style={styles.visaBadge}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
          </View>

          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={[styles.input, errors.cardNumber && styles.inputError]}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={COLORS.textTertiary}
            keyboardType="number-pad"
            maxLength={19}
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          {!!errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}

          <Text style={styles.label}>Name on Card</Text>
          <TextInput
            style={[styles.input, errors.nameOnCard && styles.inputError]}
            placeholder="Liam Carter"
            placeholderTextColor={COLORS.textTertiary}
            autoCapitalize="words"
            value={nameOnCard}
            onChangeText={setNameOnCard}
          />
          {!!errors.nameOnCard && <Text style={styles.errorText}>{errors.nameOnCard}</Text>}

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: SIZES.spacing.sm }}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={[styles.input, errors.expiry && styles.inputError]}
                placeholder="MM/YY"
                placeholderTextColor={COLORS.textTertiary}
                keyboardType="number-pad"
                maxLength={5}
                value={expiry}
                onChangeText={handleExpiryChange}
              />
              {!!errors.expiry && <Text style={styles.errorText}>{errors.expiry}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={[styles.input, errors.cvv && styles.inputError]}
                placeholder="123"
                placeholderTextColor={COLORS.textTertiary}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
              />
              {!!errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
            </View>
          </View>

          <Text style={styles.secureNote}>Your card details are encrypted and secure</Text>

          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item Total</Text>
            <Text style={styles.summaryValue}>${ORDER_SUMMARY.itemTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>${ORDER_SUMMARY.deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes</Text>
            <Text style={styles.summaryValue}>${ORDER_SUMMARY.taxes.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: SIZES.spacing.sm }]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${TOTAL_AMOUNT.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.payButton}
            activeOpacity={0.85}
            onPress={handlePay}
            disabled={status === 'loading'}
          >
            <Text style={styles.payButtonText}>
              {status === 'loading' ? 'Processing…' : `Pay $${TOTAL_AMOUNT.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContent: { alignItems: 'center', paddingBottom: SIZES.spacing.xl },
  container: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: SIZES.screenPadding,
  },
  cardPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },
  cardMasked: { fontFamily: FONT.semiBold, fontSize: SIZES.body, color: COLORS.textPrimary },
  visaBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZES.radiusSm,
  },
  visaText: { fontFamily: FONT.bold, fontSize: SIZES.caption, color: '#1A1F71' },
  label: {
    fontFamily: FONT.medium,
    fontSize: SIZES.bodySmall,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.md,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    fontFamily: FONT.regular,
    fontSize: SIZES.bodySmall,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: '#E24C4B',
  },
  errorText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: '#E24C4B',
    marginTop: 4,
  },
  row: { flexDirection: 'row' },
  secureNote: {
    fontFamily: FONT.regular,
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacing.sm,
  },
  summaryTitle: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontFamily: FONT.regular, fontSize: SIZES.bodySmall, color: COLORS.textSecondary },
  summaryValue: { fontFamily: FONT.medium, fontSize: SIZES.bodySmall, color: COLORS.textPrimary },
  totalLabel: { fontFamily: FONT.semiBold, fontSize: SIZES.body, color: COLORS.textPrimary },
  totalValue: { fontFamily: FONT.semiBold, fontSize: SIZES.body, color: COLORS.textPrimary },
  payButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
    paddingVertical: SIZES.spacing.md,
    alignItems: 'center',
    marginTop: SIZES.spacing.lg,
  },
  payButtonText: { fontFamily: FONT.semiBold, fontSize: SIZES.body, color: COLORS.white },
});