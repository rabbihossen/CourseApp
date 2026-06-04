import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {radius, spacing, shadow} from '../../../theme';
import {useTheme} from '../../../theme/ThemeContext';

const Bone = ({w, h = 14, r = 6}: {w: number | string; h?: number; r?: number}) => {
  const {colors} = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {toValue: 0.9, duration: 600, useNativeDriver: true}),
        Animated.timing(opacity, {toValue: 0.4, duration: 600, useNativeDriver: true}),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width: w as any,
        height: h,
        borderRadius: r,
        backgroundColor: colors.gray200,
        opacity,
      }}
    />
  );
};

const SkeletonCard = () => {
  const {colors} = useTheme();
  return (
    <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
      <View style={styles.topRow}>
        <Bone w={56} h={20} r={radius.full} />
        <Bone w={48} h={20} r={radius.full} />
      </View>
      <View style={styles.gap4} />
      <Bone w="80%" h={19} />
      <View style={styles.gap4} />
      <Bone w="55%" h={13} />
      <View style={styles.gap12} />
      <Bone w="100%" h={12} />
      <View style={styles.gap4} />
      <Bone w="88%" h={12} />
      <View style={styles.gap12} />
      <View style={styles.bottomRow}>
        <Bone w={90} h={13} />
        <Bone w={60} h={13} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing[16],
    marginHorizontal: spacing[16],
    marginBottom: spacing[10],
    borderWidth: 1,
    ...shadow.sm,
  },
  topRow: {flexDirection: 'row', gap: spacing[8], marginBottom: spacing[12]},
  gap4: {height: 4},
  gap12: {height: 12},
  bottomRow: {flexDirection: 'row', justifyContent: 'space-between'},
});

export default SkeletonCard;
