import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../../../navigation';
import {font, radius, shadow, spacing, text} from '../../../theme';
import {useTheme} from '../../../theme/ThemeContext';
import Badge from '../../shared/components/Badge';
import StarRating from '../../shared/components/StarRating';
import SkeletonDetail from '../../shared/components/SkeletonDetail';
import {getCourseById} from '../repository/CourseRepository';
import {useCourseStore} from '../store/courseStore';
import {CourseDTO} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

const StatBox = ({icon, label, value, colors}: {icon: string; label: string; value: string; colors: any}) => (
  <View style={styles.statBox}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, {color: colors.text}]}>{value}</Text>
    <Text style={[styles.statLabel, {color: colors.textMuted}]}>{label}</Text>
  </View>
);

const InfoRow = ({label, value, colors}: {label: string; value: string; colors: any}) => (
  <View style={styles.infoRow}>
    <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>{label}</Text>
    <Text style={[styles.infoValue, {color: colors.text}]}>{value}</Text>
  </View>
);

const CourseDetailScreen = ({route, navigation}: Props) => {
  const {courseId} = route.params;
  const {enrollCourse, unenrollCourse, courses} = useCourseStore();
  const {colors} = useTheme();

  const [course, setCourse] = useState<CourseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourseById(courseId);
      if (!data) {
        setError('Course not found');
      } else {
        setCourse(data);
        navigation.setOptions({title: ''});
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Sync enrollment state from store (optimistic updates propagate here)
  useEffect(() => {
    if (!course) return;
    const updated = courses.find(c => c.courseId === courseId);
    if (updated && updated.isEnrolled !== course.isEnrolled) {
      setCourse(prev => (prev ? {...prev, isEnrolled: updated.isEnrolled} : prev));
    }
  }, [courses, courseId]);

  const handleEnrollToggle = useCallback(async () => {
    if (!course) return;
    setEnrollLoading(true);
    // Local optimistic update mirroring the store's optimistic update
    const wasEnrolled = course.isEnrolled;
    setCourse(prev => (prev ? {...prev, isEnrolled: !wasEnrolled} : prev));
    try {
      if (wasEnrolled) {
        await unenrollCourse(courseId);
      } else {
        await enrollCourse(courseId);
      }
    } catch (e: any) {
      // Rollback local state, store already rolled back
      setCourse(prev => (prev ? {...prev, isEnrolled: wasEnrolled} : prev));
      Alert.alert('Error', e?.message ?? 'Enrollment update failed');
    } finally {
      setEnrollLoading(false);
    }
  }, [course, courseId]);

  if (loading) {
    return (
      <View style={[styles.root, {backgroundColor: colors.background}]}>
        <SkeletonDetail />
      </View>
    );
  }

  if (error || !course) {
    return (
      <View style={[styles.centered, {backgroundColor: colors.background}]}>
        <Text style={styles.errEmoji}>⚠️</Text>
        <Text style={[styles.errTitle, {color: colors.text}]}>Something went wrong</Text>
        <Text style={[styles.errBody, {color: colors.textSecondary}]}>{error ?? 'Course not found'}</Text>
      </View>
    );
  }

  const avatarHue =
    (course.instructorName.charCodeAt(0) * 37 +
      course.instructorName.charCodeAt(1 % course.instructorName.length) * 13) %
    360;

  return (
    <View style={[styles.root, {backgroundColor: colors.background}]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[styles.hero, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.heroBadges}>
            <Badge
              label={course.isPremium ? 'Premium' : 'Free'}
              variant={course.isPremium ? 'premium' : 'free'}
            />
            {course.isEnrolled && (
              <Badge label="Enrolled" variant="enrolled" style={styles.badgeGap} />
            )}
          </View>
          <Text style={[styles.heroTitle, {color: colors.text}]}>{course.title}</Text>
          <Text style={[styles.heroDesc, {color: colors.textSecondary}]}>{course.descriptionShort}</Text>
          <StarRating rating={course.rating} size={14} />
        </View>

        {/* Stats row */}
        <View style={[styles.statsRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <StatBox icon="⏱" label="Duration" value={`${course.durationWeeks} weeks`} colors={colors} />
          <View style={[styles.statDivider, {backgroundColor: colors.border}]} />
          <StatBox icon="⭐" label="Rating" value={`${course.rating} / 5`} colors={colors} />
          <View style={[styles.statDivider, {backgroundColor: colors.border}]} />
          <StatBox
            icon="💳"
            label="Price"
            value={course.priceUsd === 0 ? 'Free' : `$${course.priceUsd.toFixed(2)}`}
            colors={colors}
          />
        </View>

        {/* Instructor card */}
        <View style={[styles.section, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <Text style={[styles.sectionHead, {color: colors.textMuted}]}>Instructor</Text>
          <View style={styles.instructorCard}>
            <View style={[styles.bigAvatar, {backgroundColor: `hsl(${avatarHue},55%,88%)`}]}>
              <Text style={[styles.bigAvatarText, {color: `hsl(${avatarHue},55%,32%)`}]}>
                {course.instructorName
                  .split(' ')
                  .map(w => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.instructorMeta}>
              <Text style={[styles.instructorName, {color: colors.text}]}>{course.instructorName}</Text>
              {course.instructorExpertiseLevel ? (
                <Text style={[styles.instructorRole, {color: colors.textSecondary}]}>
                  {course.instructorExpertiseLevel}
                </Text>
              ) : null}
              {course.instructorId ? (
                <Text style={[styles.instructorId, {color: colors.textMuted}]}>ID · {course.instructorId}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Tags */}
        {course.tags.length > 0 && (
          <View style={[styles.section, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Text style={[styles.sectionHead, {color: colors.textMuted}]}>Topics covered</Text>
            <View style={styles.tagsWrap}>
              {course.tags.map(tag => (
                <Badge key={tag} label={tag} variant="tag" style={styles.tagGap} />
              ))}
            </View>
          </View>
        )}

        {/* Details */}
        <View style={[styles.section, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <Text style={[styles.sectionHead, {color: colors.textMuted}]}>Course details</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Course ID" value={course.courseId} colors={colors} />
            <View style={[styles.infoSep, {backgroundColor: colors.borderLight}]} />
            <InfoRow label="Type" value={course.isPremium ? 'Premium' : 'Free'} colors={colors} />
            <View style={[styles.infoSep, {backgroundColor: colors.borderLight}]} />
            <InfoRow label="Duration" value={`${course.durationWeeks} weeks`} colors={colors} />
            <View style={[styles.infoSep, {backgroundColor: colors.borderLight}]} />
            <InfoRow
              label="Price"
              value={course.priceUsd === 0 ? 'Free' : `$${course.priceUsd.toFixed(2)}`}
              colors={colors}
            />
            <View style={[styles.infoSep, {backgroundColor: colors.borderLight}]} />
            <InfoRow
              label="Last updated"
              value={new Date(course.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              colors={colors}
            />
          </View>
        </View>

        <View style={styles.btnSpacer} />
      </ScrollView>

      {/* Floating enroll button */}
      <View style={[styles.btnWrap, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        <TouchableOpacity
          style={[styles.enrollBtn, course.isEnrolled && styles.enrollBtnEnrolled, enrollLoading && styles.enrollBtnDisabled]}
          onPress={handleEnrollToggle}
          disabled={enrollLoading}
          activeOpacity={0.88}>
          <>
            <Text style={styles.enrollBtnIcon}>
              {course.isEnrolled ? '✓' : '🎓'}
            </Text>
            <Text style={styles.enrollBtnText}>
              {enrollLoading
                ? course.isEnrolled ? 'Removing…' : 'Enrolling…'
                : course.isEnrolled ? 'Remove Enrollment' : 'Enroll in this Course'}
            </Text>
          </>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
  scroll: {paddingBottom: spacing[16]},

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[32],
  },
  errEmoji: {fontSize: 44, marginBottom: spacing[16]},
  errTitle: {
    fontSize: 18,
    fontWeight: font.semibold,
    marginBottom: spacing[8],
    textAlign: 'center',
  },
  errBody: {
    ...text.sm,
    textAlign: 'center',
  },

  hero: {
    paddingHorizontal: spacing[20],
    paddingTop: spacing[20],
    paddingBottom: spacing[24],
    borderBottomWidth: 1,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: spacing[8],
    marginBottom: spacing[12],
  },
  badgeGap: {},
  heroTitle: {
    fontSize: 22,
    fontWeight: font.bold,
    letterSpacing: -0.4,
    lineHeight: 30,
    marginBottom: spacing[10],
  },
  heroDesc: {
    ...text.base,
    lineHeight: 22,
    marginBottom: spacing[12],
  },

  statsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: spacing[16],
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[16],
  },
  statDivider: {
    width: 1,
    marginVertical: spacing[12],
  },
  statIcon: {fontSize: 18, marginBottom: spacing[6]},
  statValue: {
    fontSize: 14,
    fontWeight: font.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: font.medium,
  },

  section: {
    marginHorizontal: spacing[16],
    marginBottom: spacing[16],
    borderRadius: radius.lg,
    padding: spacing[16],
    borderWidth: 1,
    ...shadow.sm,
  },
  sectionHead: {
    fontSize: 12,
    fontWeight: font.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: spacing[12],
  },

  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[16],
  },
  bigAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigAvatarText: {fontSize: 18, fontWeight: font.bold},
  instructorMeta: {flex: 1},
  instructorName: {
    fontSize: 16,
    fontWeight: font.semibold,
    marginBottom: 3,
  },
  instructorRole: {
    fontSize: 13,
    marginBottom: 2,
  },
  instructorId: {fontSize: 11},

  tagsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing[6]},
  tagGap: {},

  infoCard: {},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[10],
  },
  infoSep: {height: 1},
  infoLabel: {
    fontSize: 13,
    fontWeight: font.medium,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: font.semibold,
    maxWidth: '55%',
    textAlign: 'right',
  },

  btnSpacer: {height: 100},
  btnWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[32],
    paddingTop: spacing[12],
    borderTopWidth: 1,
  },
  enrollBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: radius.lg,
    paddingVertical: spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[8],
    ...shadow.md,
  },
  enrollBtnEnrolled: {
    backgroundColor: '#374151',
  },
  enrollBtnDisabled: {
    opacity: 0.75,
  },
  enrollBtnIcon: {fontSize: 17},
  enrollBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: font.bold,
    letterSpacing: 0.1,
  },
});

export default CourseDetailScreen;
