/**
 * Theme configuration for Futbolista app.
 * Identity: Modern trading card album / sports video game aesthetic.
 */

export const COLORS = {
  // Primary Palette
  background: '#F7F8F3', // Warm white
  primary: '#174D38',    // Dark green
  primaryLight: '#236E52', // Lighter dark green for press states
  secondary: '#E4EFE6',  // Soft green for badges & secondary surfaces
  accent: '#E8C75A',     // Yellow accent for highlights & numbers
  accentDark: '#C9A332',

  // Neutral Palette
  textPrimary: '#202B25',   // Dark text
  textSecondary: '#5A6B62', // Muted text
  textLight: '#8A9B91',     // Soft label text
  white: '#FFFFFF',
  cardBackground: '#FFFFFF',
  borderColor: '#E2ECE5',
  borderHighlight: '#CBE0D1',

  // Status & Feedback
  errorBg: '#FDF2F2',
  errorBorder: '#F8B4B4',
  errorText: '#9B1C1C',
  successBg: '#DEF7EC',
  successText: '#03543F',

  // Pitch graphics
  pitchLine: 'rgba(23, 77, 56, 0.12)',
  cardShadow: 'rgba(23, 77, 56, 0.08)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  card: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHover: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 5,
  },
};
