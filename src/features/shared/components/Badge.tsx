import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {colors, radius, font} from '../../../theme';

interface BadgeProps {
  label: string;
  variant?: 'premium' | 'free' | 'enrolled' | 'tag' | 'default';
  style?: ViewStyle;
}

const config: Record<string, {bg: string; text: string; border: string}> = {
  premium: {bg: colors.amberLight, text: colors.amber, border: '#FDE68A'},
  free: {bg: colors.successLight, text: colors.success, border: '#6EE7B7'},
  enrolled: {bg: colors.indigoLight, text: colors.indigo, border: '#C7D2FE'},
  tag: {bg: colors.gray100, text: colors.gray600, border: colors.gray200},
  default: {bg: colors.gray100, text: colors.gray500, border: colors.gray200},
};

const Badge = React.memo(({label, variant = 'default', style}: BadgeProps) => {
  const c = config[variant];
  return (
    <View style={[styles.pill, {backgroundColor: c.bg, borderColor: c.border}, style]}>
      <Text style={[styles.label, {color: c.text}]}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: font.semibold,
    letterSpacing: 0.2,
  },
});

export default Badge;
