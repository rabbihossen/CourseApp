import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font} from '../../../theme';

interface StarRatingProps {
  rating: number;
  size?: number;
  showCount?: boolean;
}

const StarRating = React.memo(({rating, size = 12, showCount = true}: StarRatingProps) => {
  const filled = Math.round(rating);
  return (
    <View style={styles.row}>
      {Array.from({length: 5}).map((_, i) => (
        <Text
          key={i}
          style={{
            fontSize: size,
            color: i < filled ? colors.star : colors.gray200,
            marginRight: 1,
          }}>
          ★
        </Text>
      ))}
      {showCount && (
        <Text style={[styles.score, {fontSize: size + 1}]}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  score: {
    marginLeft: 5,
    fontWeight: font.semibold,
    color: colors.textSecondary,
  },
});

export default StarRating;
