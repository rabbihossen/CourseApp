import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {font, radius, shadow, spacing, text} from '../../../theme';
import {useTheme} from '../../../theme/ThemeContext';
import {CourseDTO} from '../types';
import Badge from '../../shared/components/Badge';
import StarRating from '../../shared/components/StarRating';

interface CourseCardProps {
  course: CourseDTO;
  onPress: () => void;
}

const InstructorAvatar = ({name}: {name: string}) => {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1 % name.length) * 13) % 360;
  return (
    <View style={[styles.avatar, {backgroundColor: `hsl(${hue},55%,88%)`}]}>
      <Text style={[styles.avatarText, {color: `hsl(${hue},55%,35%)`}]}>{initials}</Text>
    </View>
  );
};

const CourseCard = React.memo(({course, onPress}: CourseCardProps) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}
      onPress={onPress}
      activeOpacity={0.92}>

      {/* Top metadata row */}
      <View style={styles.topRow}>
        <View style={styles.badges}>
          <Badge
            label={course.isPremium ? 'Premium' : 'Free'}
            variant={course.isPremium ? 'premium' : 'free'}
          />
          {course.isEnrolled && (
            <Badge label="Enrolled" variant="enrolled" style={styles.badgeGap} />
          )}
        </View>
        <Text style={[styles.price, {color: colors.indigo}]}>
          {course.priceUsd === 0 ? 'Free' : `$${course.priceUsd.toFixed(0)}`}
        </Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, {color: colors.text}]} numberOfLines={2}>
        {course.title}
      </Text>

      {/* Description */}
      <Text style={[styles.description, {color: colors.textSecondary}]} numberOfLines={2}>
        {course.descriptionShort}
      </Text>

      {/* Divider */}
      <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.instructorRow}>
          <InstructorAvatar name={course.instructorName} />
          <View style={styles.instructorText}>
            <Text style={[styles.instructorName, {color: colors.gray700}]} numberOfLines={1}>
              {course.instructorName}
            </Text>
            {course.instructorExpertiseLevel ? (
              <Text style={[styles.instructorRole, {color: colors.textMuted}]} numberOfLines={1}>
                {course.instructorExpertiseLevel}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.stats}>
          <StarRating rating={course.rating} size={11} />
          <View style={[styles.statChip, {backgroundColor: colors.gray100}]}>
            <Text style={[styles.statText, {color: colors.gray600}]}>{course.durationWeeks}w</Text>
          </View>
        </View>
      </View>

      {/* Tags */}
      {course.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {course.tags.slice(0, 3).map(tag => (
            <Badge key={tag} label={tag} variant="tag" style={styles.tagGap} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing[16],
    marginHorizontal: spacing[16],
    marginBottom: spacing[10],
    borderWidth: 1,
    ...shadow.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  badges: {flexDirection: 'row', alignItems: 'center', gap: spacing[6]},
  badgeGap: {},
  price: {
    ...text.base,
    fontWeight: font.bold,
  },
  title: {
    fontSize: 16,
    fontWeight: font.bold,
    lineHeight: 23,
    marginBottom: spacing[6],
    letterSpacing: -0.2,
  },
  description: {
    ...text.sm,
    lineHeight: 19,
    marginBottom: spacing[12],
  },
  divider: {
    height: 1,
    marginBottom: spacing[12],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    flex: 1,
    marginRight: spacing[8],
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {fontSize: 11, fontWeight: font.bold},
  instructorText: {flex: 1},
  instructorName: {
    fontSize: 12,
    fontWeight: font.semibold,
  },
  instructorRole: {
    fontSize: 11,
    marginTop: 1,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  statChip: {
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  statText: {
    fontSize: 11,
    fontWeight: font.semibold,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[6],
    marginTop: spacing[10],
  },
  tagGap: {},
});

export default CourseCard;
