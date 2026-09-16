import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface PositionBadgeProps {
  position: string;
  size?: 'small' | 'medium' | 'large';
}

export const PositionBadge: React.FC<PositionBadgeProps> = ({
  position,
  size = 'small',
}) => {
  return (
    <View style={[styles.badge, styles[size]]}>
      <Text style={[styles.text, styles[`${size}Text`]]} numberOfLines={1}>
        {position || 'No disponible'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  small: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  medium: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
  },
  large: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
  },
  text: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  smallText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 13,
  },
  largeText: {
    fontSize: 14,
  },
});
