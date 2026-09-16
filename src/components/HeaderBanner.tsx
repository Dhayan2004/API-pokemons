import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface HeaderBannerProps {
  subtitle?: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  subtitle = 'Conoce a quienes hacen el juego',
}) => {
  return (
    <View style={styles.container}>
      {/* Decorative Pitch Line Accents */}
      <View style={styles.pitchCenterCircle} />
      <View style={styles.pitchHalfLine} />

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>ÁLBUM OFICIAL</Text>
        </View>
        <Text style={styles.title}>Futbolista</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  content: {
    zIndex: 2,
    alignItems: 'flex-start',
  },
  badgeRow: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 2,
    fontWeight: '500',
  },
  pitchCenterCircle: {
    position: 'absolute',
    right: -30,
    top: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: COLORS.pitchLine,
    zIndex: 1,
  },
  pitchHalfLine: {
    position: 'absolute',
    right: 40,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.pitchLine,
    zIndex: 1,
  },
});
