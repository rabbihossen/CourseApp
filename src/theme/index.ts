import {Platform} from 'react-native';

export const lightColors = {
  // Brand
  indigo: '#4F46E5',
  indigoDark: '#3730A3',
  indigoLight: '#EEF2FF',
  indigoMid: '#818CF8',

  // Semantic
  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',

  // Premium
  amber: '#D97706',
  amberLight: '#FEF3C7',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Aliases
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textOnDark: '#FFFFFF',
  star: '#F59E0B',
};

export const darkColors: typeof lightColors = {
  // Brand (slightly lighter for dark bg)
  indigo: '#818CF8',
  indigoDark: '#6366F1',
  indigoLight: '#1E1B4B',
  indigoMid: '#A5B4FC',

  // Semantic
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#451A03',
  error: '#F87171',
  errorLight: '#450A0A',

  // Premium
  amber: '#FBBF24',
  amberLight: '#451A03',

  // Neutrals (inverted)
  white: '#FFFFFF',
  gray50: '#111827',
  gray100: '#1F2937',
  gray200: '#374151',
  gray300: '#4B5563',
  gray400: '#6B7280',
  gray500: '#9CA3AF',
  gray600: '#D1D5DB',
  gray700: '#E5E7EB',
  gray800: '#F3F4F6',
  gray900: '#F9FAFB',

  // Aliases
  background: '#0F172A',
  surface: '#1E293B',
  surfaceRaised: '#263347',
  border: '#334155',
  borderLight: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textOnDark: '#FFFFFF',
  star: '#FBBF24',
};

export const colors = lightColors;

export const spacing = {
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  56: 56,
  64: 64,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const shadow = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    android: {elevation: 2},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: {elevation: 4},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: {elevation: 8},
  }),
};

export const font = {
  // Weight names map to numeric values for RN
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const text = {
  xs: {fontSize: 11, lineHeight: 16},
  sm: {fontSize: 13, lineHeight: 20},
  base: {fontSize: 15, lineHeight: 24},
  lg: {fontSize: 17, lineHeight: 26},
  xl: {fontSize: 20, lineHeight: 30},
  '2xl': {fontSize: 24, lineHeight: 34},
  '3xl': {fontSize: 30, lineHeight: 40},
};
