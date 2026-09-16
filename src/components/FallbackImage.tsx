import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS } from '../constants/theme';

interface FallbackImageProps {
  name?: string;
  number?: string | null;
  height?: number;
}

export const FallbackImage: React.FC<FallbackImageProps> = ({
  name = '',
  number,
  height = 140,
}) => {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.iconCircle}>
        <Ionicons name="person-sharp" size={height * 0.4} color={COLORS.primary} />
      </View>
      {number ? (
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>#{number}</Text>
        </View>
      ) : (
        <Text style={styles.initialText}>{initial}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(23, 77, 56, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  initialText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
