import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {colors, font, spacing} from '../../../theme';

interface OfflineBannerProps {
  visible: boolean;
}

const OfflineBanner = React.memo(({visible}: OfflineBannerProps) => {
  const translateY = useRef(new Animated.Value(-48)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : -48,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [visible, translateY]);

  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
      <View style={styles.dot} />
      <Text style={styles.text}>No internet · Showing cached data</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: colors.gray800,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[10],
    gap: spacing[8],
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.warningLight,
  },
  text: {
    color: colors.gray200,
    fontSize: 12,
    fontWeight: font.medium,
    letterSpacing: 0.1,
  },
});

export default OfflineBanner;
