import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {font, radius, spacing} from '../../../theme';
import {useTheme} from '../../../theme/ThemeContext';
import {SortField, SortOrder} from '../types';

interface FilterBarProps {
  isPremium: boolean | null;
  isEnrolled: boolean | null;
  sortField: SortField;
  sortOrder: SortOrder;
  onSetPremium: (v: boolean | null) => void;
  onSetEnrolled: (v: boolean | null) => void;
  onSetSortField: (f: SortField) => void;
  onSetSortOrder: (o: SortOrder) => void;
}

type Chip<T> = {label: string; value: T};

const typeChips: Chip<boolean | null>[] = [
  {label: 'All', value: null},
  {label: 'Free', value: false},
  {label: 'Premium', value: true},
];

const enrolledChips: Chip<boolean | null>[] = [
  {label: 'All', value: null},
  {label: 'Enrolled', value: true},
  {label: 'Not Enrolled', value: false},
];

const sortChips: Chip<SortField>[] = [
  {label: 'Rating', value: 'rating'},
  {label: 'Price', value: 'price_usd'},
  {label: 'Duration', value: 'duration_weeks'},
];

function Pill<T>({
  label,
  active,
  onPress,
  suffix,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  suffix?: string;
}) {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        {borderColor: colors.border, backgroundColor: colors.surface},
        active && {backgroundColor: colors.indigo, borderColor: colors.indigo},
      ]}
      onPress={onPress}
      activeOpacity={0.75}>
      <Text style={[
        styles.pillText,
        {color: colors.textSecondary},
        active && {color: colors.textOnDark, fontWeight: font.semibold},
      ]}>
        {label}
        {suffix ? ` ${suffix}` : ''}
      </Text>
    </TouchableOpacity>
  );
}

const SectionLabel = ({label}: {label: string}) => {
  const {colors} = useTheme();
  return <Text style={[styles.sectionLabel, {color: colors.textMuted}]}>{label}</Text>;
};

const FilterBar = React.memo(
  ({
    isPremium,
    isEnrolled,
    sortField,
    sortOrder,
    onSetPremium,
    onSetEnrolled,
    onSetSortField,
    onSetSortOrder,
  }: FilterBarProps) => {
    const {colors} = useTheme();
    return (
      <View style={[styles.container, {borderBottomColor: colors.border, backgroundColor: colors.surface}]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}>
          {/* Type filter */}
          <SectionLabel label="Type" />
          {typeChips.map(c => (
            <Pill
              key={String(c.value)}
              label={c.label}
              active={isPremium === c.value}
              onPress={() => onSetPremium(c.value)}
            />
          ))}

          <View style={[styles.sep, {backgroundColor: colors.border}]} />

          {/* Enrollment filter */}
          <SectionLabel label="Status" />
          {enrolledChips.map(c => (
            <Pill
              key={String(c.value)}
              label={c.label}
              active={isEnrolled === c.value}
              onPress={() => onSetEnrolled(c.value)}
            />
          ))}

          <View style={[styles.sep, {backgroundColor: colors.border}]} />

          {/* Sort */}
          <SectionLabel label="Sort" />
          {sortChips.map(c => (
            <Pill
              key={c.value}
              label={c.label}
              active={sortField === c.value}
              suffix={sortField === c.value ? (sortOrder === 'asc' ? '↑' : '↓') : undefined}
              onPress={() => {
                if (sortField === c.value) {
                  onSetSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  onSetSortField(c.value);
                }
              }}
            />
          ))}
        </ScrollView>
      </View>
    );
  },
);


const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[10],
    gap: spacing[6],
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: font.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginRight: spacing[2],
  },
  sep: {
    width: 1,
    height: 18,
    marginHorizontal: spacing[6],
  },
  pill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: font.medium,
  },
});

export default FilterBar;
