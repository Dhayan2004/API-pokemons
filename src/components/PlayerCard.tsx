import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Player } from '../types/player';
import { PositionBadge } from './PositionBadge';
import { PlayerImage } from './PlayerImage';
import { useComparison } from '../context/ComparisonContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface PlayerCardProps {
  player: Player;
  onPress: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onPress }) => {
  const { selectingSlot, selectPlayer, whichSlot } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const assignedSlot = whichSlot(player.idPlayer);
  const isSelectedForOther = selectingSlot !== null && assignedSlot !== null && assignedSlot !== selectingSlot;
  const isSelectedForCurrent = selectingSlot !== null && assignedSlot === selectingSlot;
  const isFav = isFavorite(player.idPlayer);

  const handleCardPress = async () => {
    if (selectingSlot !== null) {
      if (isSelectedForOther) {
        showToast(
          `"${player.strPlayer}" ya está seleccionado como Jugador ${assignedSlot}. Elige a otro futbolista.`,
          'warning'
        );
        return;
      }
      const res = await selectPlayer(player, selectingSlot);
      if (!res.success && res.message) {
        showToast(res.message, 'warning');
      } else {
        showToast(`"${player.strPlayer}" asignado como Jugador ${selectingSlot}`, 'success');
      }
      return;
    }
    onPress();
  };

  const handleCompareClick = async (e: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const res = await selectPlayer(player);
    if (!res.success && res.message) {
      showToast(res.message, 'warning');
    } else if (res.message) {
      showToast(res.message, 'success');
    }
  };

  const handleFavoriteClick = async (e: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    await toggleFavorite(player);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handleCardPress}
      style={[
        styles.cardContainer,
        selectingSlot !== null && !isSelectedForOther && styles.cardContainerSelecting,
        isSelectedForOther && styles.cardContainerDisabled,
      ]}
    >
      {/* Top Image & Action Badges */}
      <View style={styles.imageContainer}>
        {/* Heart Favorite Button (Top-Left) */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteClick}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={19}
            color={isFav ? '#E02424' : COLORS.textSecondary}
          />
        </TouchableOpacity>

        {/* Number Badge (Top-Right) */}
        {player.strNumber && (
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>#{player.strNumber}</Text>
          </View>
        )}

        <PlayerImage
          cutoutUrl={player.imageUrl}
          thumbUrl={player.thumbUrl}
          name={player.strPlayer}
          number={player.strNumber}
          height={148}
        />
      </View>

      {/* Card Body Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.playerName} numberOfLines={1}>
          {player.strPlayer}
        </Text>

        <Text style={styles.teamName} numberOfLines={1}>
          {player.strTeam}
        </Text>

        <View style={styles.metaRow}>
          <PositionBadge position={player.positionInfo.positionEs} size="small" />

          {selectingSlot !== null ? (
            <View
              style={[
                styles.selectActionBadge,
                isSelectedForOther && styles.selectActionBadgeDisabled,
              ]}
            >
              <Text
                style={[
                  styles.selectActionText,
                  isSelectedForOther && styles.selectActionTextDisabled,
                ]}
              >
                {isSelectedForOther
                  ? `En J${assignedSlot}`
                  : isSelectedForCurrent
                  ? 'Actual'
                  : `Elegir J${selectingSlot}`}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.compareButton,
                assignedSlot !== null && styles.compareButtonActive,
              ]}
              onPress={handleCompareClick}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={assignedSlot !== null ? 'checkmark-circle' : 'swap-horizontal'}
                size={13}
                color={assignedSlot !== null ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.compareButtonText,
                  assignedSlot !== null && styles.compareButtonTextActive,
                ]}
              >
                {assignedSlot !== null ? `J${assignedSlot}` : 'Comparar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Decorative Card Footer Accent */}
      <View
        style={[
          styles.cardAccentBar,
          assignedSlot !== null && { backgroundColor: COLORS.accentDark },
        ]}
      />
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
  cardContainerSelecting: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  cardContainerDisabled: {
    opacity: 0.55,
  },
  imageContainer: {
    height: 148,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    ...SHADOWS.card,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 2,
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    minHeight: 28,
  },
  compareButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  compareButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  compareButtonTextActive: {
    color: COLORS.primary,
  },
  selectActionBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  selectActionBadgeDisabled: {
    backgroundColor: COLORS.textLight,
  },
  selectActionText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  selectActionTextDisabled: {
    color: COLORS.white,
  },
  cardAccentBar: {
    height: 4,
    backgroundColor: COLORS.primary,
    width: '100%',
  },
});
