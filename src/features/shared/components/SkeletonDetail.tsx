import React, {useEffect, useRef} from 'react';
import {Animated, ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from '../../../theme/ThemeContext';
import {radius, spacing, shadow} from '../../../theme';

function Bone({w, h = 14, r = 6}: {w: number | string; h?: number; r?: number}) {
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
}

export default function SkeletonDetail() {
  const {colors} = useTheme();

  return (
    <ScrollView
      style={[styles.scroll, {backgroundColor: colors.background}]}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={[styles.hero, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        <View style={styles.row}>
          <Bone w={64} h={22} r={radius.full} />
          <Bone w={50} h={22} r={radius.full} />
        </View>
        <View style={styles.gap12} />
        <Bone w="85%" h={22} />
        <View style={styles.gap8} />
        <Bone w="60%" h={16} />
        <View style={styles.gap12} />
        <Bone w={100} h={14} />
      </View>

      {/* Stats row */}
      <View style={[styles.statsRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        {[0, 1, 2].map(i => (
          <React.Fragment key={i}>
            {i > 0 && <View style={[styles.statDiv, {backgroundColor: colors.border}]} />}
            <View style={styles.statBox}>
              <Bone w={22} h={22} r={11} />
              <View style={styles.gap6} />
              <Bone w={50} h={14} />
              <View style={styles.gap4} />
              <Bone w={40} h={11} />
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Section cards */}
      {[80, 60, 100].map((pct, i) => (
        <View key={i} style={[styles.section, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <Bone w={70} h={12} />
          <View style={styles.gap12} />
          <View style={styles.row}>
            <Bone w={48} h={48} r={24} />
            <View style={styles.flex1}>
              <Bone w="70%" h={15} />
              <View style={styles.gap6} />
              <Bone w="50%" h={12} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {flex: 1},
  hero: {
    paddingHorizontal: spacing[20],
    paddingTop: spacing[20],
    paddingBottom: spacing[24],
    borderBottomWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: spacing[16],
  },
  statBox: {flex: 1, alignItems: 'center', paddingVertical: spacing[16]},
  statDiv: {width: 1, marginVertical: spacing[12]},
  section: {
    marginHorizontal: spacing[16],
    marginBottom: spacing[16],
    borderRadius: radius.lg,
    padding: spacing[16],
    borderWidth: 1,
    ...shadow.sm,
  },
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing[12]},
  flex1: {flex: 1},
  gap4: {height: 4},
  gap6: {height: 6},
  gap8: {height: 8},
  gap12: {height: 12},
});
