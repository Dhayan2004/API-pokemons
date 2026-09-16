import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Player } from '../types/player';
import { PositionBadge } from './PositionBadge';
import { FallbackImage } from './FallbackImage';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface PlayerCardProps {
  player: Player;
  onPress: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onPress }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.cardContainer}
    >
      {/* Top Banner & Number Badge */}
      <View style={styles.imageContainer}>
        {player.strNumber && (
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>#{player.strNumber}</Text>
          </View>
        )}

        {player.imageUrl && !imgError ? (
          <Image
            source={{ uri: player.imageUrl }}
            style={styles.playerImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <FallbackImage name={player.strPlayer} number={player.strNumber} height={130} />
        )}
      </View>

      {/* Card Body Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.playerName} numberOfLines={1}>
          {player.strPlayer}
        </Text>

        <Text style={styles.teamName} numberOfLines={1}>
          {player.strTeam}
        </Text>

        <View style={styles.badgeWrapper}>
          <PositionBadge position={player.positionInfo.positionEs} size="small" />
        </View>
      </View>

      {/* Decorative Card Footer Accent */}
      <View style={styles.cardAccentBar} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    width: '100%',
    ...SHADOWS.card,
  },
  imageContainer: {
    height: 135,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  numberBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    zIndex: 10,
  },
  numberText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  infoContainer: {
    padding: SPACING.md,
    alignItems: 'flex-start',
  },
  playerName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  badgeWrapper: {
    marginTop: 2,
  },
  cardAccentBar: {
    height: 4,
    backgroundColor: COLORS.primary,
    width: '100%',
  },
});
