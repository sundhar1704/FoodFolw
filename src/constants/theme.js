// ============================================================
// Food Flow — Design System
// Single source of truth for color, type, spacing, radius.
// Every screen must import from here — never hardcode values.
// ============================================================

export const COLORS = {
  primary: '#FB5203',      // brand orange — buttons, active states, prices, links
  primaryLight: '#FFF1EA', // soft orange tint — icon chips, badges
  black: '#000000',
  textPrimary: '#1A1A1A',  // headings
  textSecondary: '#8A8A8A',// sub text / placeholders
  textTertiary: '#B0B0B0',
  white: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F2F2F2',      // input fields, tab pill background
  surfaceAlt: '#F6F6F6',   // cards on white bg (orders, popular items)
  border: '#E5E5E5',
  divider: '#EAEAEA',
  success: '#1E8E3E',      // "Delivered" text
  successBg: '#E8F5E9',
  google: '#4285F4',
  facebook: '#1877F2',
};

export const FONT = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const SIZES = {
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,

  radiusSm: 10,
  radiusMd: 16,
  radiusLg: 24,
  radiusPill: 100,

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  screenPadding: 20,
};

export default { COLORS, FONT, SIZES };
