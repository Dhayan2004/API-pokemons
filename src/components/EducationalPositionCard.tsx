import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PositionEducationalInfo } from '../types/player';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface EducationalPositionCardProps {
  info: PositionEducationalInfo;
}

export const EducationalPositionCard: React.FC<EducationalPositionCardProps> = ({ info }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="school-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.badgeLabel}>ROL TÁCTICO EN EL CAMPO</Text>
          <Text style={styles.positionTitle}>{info.positionEs}</Text>
        </View>
      </View>

      <Text style={styles.description}>{info.descriptionEs}</Text>

      <View style={styles.categoryFooter}>
        <Text style={styles.categoryLabel}>Categoría táctica: </Text>
        <Text style={styles.categoryValue}>{info.category}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  titleContainer: {
    flex: 1,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  positionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginVertical: SPACING.xs,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(23, 77, 56, 0.1)',
  },
  categoryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  categoryValue: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
