import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBanner } from '../../components/HeaderBanner';
import { PlayerImage } from '../../components/PlayerImage';
import { PositionBadge } from '../../components/PositionBadge';
import { useComparison } from '../../context/ComparisonContext';
import { useToast } from '../../context/ToastContext';
import {
  getAgeDifference,
  getHeightDifference,
  getWeightDifference,
} from '../../utils/playerData';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Player } from '../../types/player';

export default function CompararScreen() {
  const { player1, player2, startSelecting, removePlayer, clearComparison } = useComparison();
  const { showToast } = useToast();


  const isBothSelected = player1 !== null && player2 !== null;

  const ageDiff = isBothSelected ? getAgeDifference(player1, player2) : null;
  const heightDiff = isBothSelected ? getHeightDifference(player1, player2) : null;
  const weightDiff = isBothSelected ? getWeightDifference(player1, player2) : null;

  const renderPlayerSlot = (
    player: Player | null,
    slotNumber: 1 | 2,
    label: string
  ) => {
    if (!player) {
      return (
        <View style={styles.slotCardEmpty}>
          <View style={styles.slotBadgeRow}>
            <Text style={styles.slotBadgeText}>{label.toUpperCase()}</Text>
          </View>

          <View style={styles.emptySlotIconCircle}>
            <Ionicons name="person-add-outline" size={36} color={COLORS.primary} />
          </View>

          <Text style={styles.emptySlotTitle}>Espacio vacío</Text>
          <Text style={styles.emptySlotSub}>Selecciona un futbolista para comparar</Text>

          <TouchableOpacity
            style={styles.choosePlayerBtn}
            onPress={() => startSelecting(slotNumber)}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={18} color={COLORS.white} />
            <Text style={styles.choosePlayerBtnText}>Elegir jugador</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.slotCardOccupied}>
        <View style={styles.slotBadgeRow}>
          <Text style={styles.slotBadgeText}>{label.toUpperCase()}</Text>
          {player.strNumber && (
            <Text style={styles.slotNumberText}>#{player.strNumber}</Text>
          )}
        </View>

        {/* Player Portrait with complete head framing */}
        <View style={styles.slotImageContainer}>
          <PlayerImage
            cutoutUrl={player.imageUrl}
            thumbUrl={player.thumbUrl}
            name={player.strPlayer}
            number={player.strNumber}
            height={130}
          />
        </View>

        <View style={styles.slotInfo}>
          <Text style={styles.slotPlayerName} numberOfLines={2}>
            {player.strPlayer}
          </Text>
          <Text style={styles.slotTeamName} numberOfLines={1}>
            {player.strTeam}
          </Text>
          <PositionBadge position={player.positionInfo.positionEs} size="small" />
        </View>

        <View style={styles.slotActionsRow}>
          <TouchableOpacity
            style={styles.slotChangeBtn}
            onPress={() => startSelecting(slotNumber)}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-horizontal" size={14} color={COLORS.primary} />
            <Text style={styles.slotChangeBtnText}>Cambiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.slotRemoveBtn}
            onPress={() => {
              removePlayer(slotNumber);
              showToast(`Jugador ${slotNumber} quitado de la comparación`, 'info');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={14} color={COLORS.errorText} />
            <Text style={styles.slotRemoveBtnText}>Quitar</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  };

  const renderComparisonRow = (
    label: string,
    val1: string,
    val2: string,
    icon: string
  ) => {

    return (
      <View style={styles.compRow}>
        <View style={styles.compSideValLeft}>
          <Text style={styles.compValText} numberOfLines={2}>
            {val1}
          </Text>
        </View>

        <View style={styles.compCenterLabel}>
          <Ionicons name={icon} size={15} color={COLORS.primary} />
          <Text style={styles.compLabelText}>{label}</Text>
        </View>

        <View style={styles.compSideValRight}>
          <Text style={styles.compValText} numberOfLines={2}>
            {val2}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBanner subtitle="Comparador objetivo de futbolistas" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        <View style={styles.headerTitleRow}>
          <Text style={styles.pageTitle}>Comparador Objetivo</Text>
          {isBothSelected && (
            <TouchableOpacity
              style={styles.clearAllBtn}
              onPress={() => {
                clearComparison();
                showToast('Comparación reiniciada', 'info');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.clearAllText}>Reiniciar</Text>
            </TouchableOpacity>
          )}

        </View>
        <Text style={styles.pageSubtitle}>
          Enfrenta a dos futbolistas para analizar sus características descriptivas y diferencias
          calculadas en el frontend.
        </Text>

        {/* Two Slots Row */}
        <View style={styles.slotsRow}>
          <View style={styles.slotCol}>
            {renderPlayerSlot(player1, 1, 'Jugador 1')}
          </View>
          <View style={styles.vsBadge}>
            <Text style={styles.vsBadgeText}>VS</Text>
          </View>
          <View style={styles.slotCol}>
            {renderPlayerSlot(player2, 2, 'Jugador 2')}
          </View>
        </View>

        {/* Case 1: Less than 2 players selected */}
        {!isBothSelected ? (
          <View style={styles.instructionsCard}>
            <View style={styles.instructionsIconCircle}>
              <Ionicons name="swap-horizontal" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.instructionsTitle}>
              {!player1 && !player2
                ? 'Elige a dos futbolistas para comenzar'
                : 'Falta un futbolista para la comparación'}
            </Text>
            <Text style={styles.instructionsText}>
              {!player1 && !player2
                ? 'Presiona "Elegir jugador" en cualquiera de los espacios o utiliza el botón "Comparar" en las tarjetas de Inicio o en la ficha de detalle.'
                : 'Selecciona al segundo jugador para calcular automáticamente las diferencias de edad, estatura y peso.'}
            </Text>
          </View>
        ) : (
          /* Case 2: Both players selected - Display Side-by-Side Comparison */
          <View style={styles.comparisonSection}>
            {/* Table Card */}
            <View style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Ionicons name="bar-chart-outline" size={18} color={COLORS.primary} />
                <Text style={styles.tableTitle}>Datos Objetivos Frente a Frente</Text>
              </View>

              {renderComparisonRow(
                'Posición',
                player1.positionInfo.positionEs,
                player2.positionInfo.positionEs,
                'football-outline'
              )}

              {renderComparisonRow(
                'Edad',
                player1.age !== null ? `${player1.age} años` : 'No disponible',
                player2.age !== null ? `${player2.age} años` : 'No disponible',
                'time-outline'
              )}

              {renderComparisonRow(
                'Estatura',
                player1.formattedHeight,
                player2.formattedHeight,
                'resize-outline'
              )}

              {renderComparisonRow(
                'Peso',
                player1.formattedWeight,
                player2.formattedWeight,
                'fitness-outline'
              )}

              {renderComparisonRow(
                'Nacionalidad',
                player1.strNationality,
                player2.strNationality,
                'flag-outline'
              )}

              {renderComparisonRow(
                'Equipo',
                player1.strTeam,
                player2.strTeam,
                'shirt-outline'
              )}
            </View>

            {/* Differences Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Ionicons name="analytics-outline" size={20} color={COLORS.primary} />
                <Text style={styles.summaryTitle}>Resumen de Diferencias</Text>
              </View>
              <Text style={styles.summarySubtitle}>
                Diferencias calculadas a partir de los datos registrados en la API:
              </Text>

              <View style={styles.diffItemsList}>
                {/* Age diff */}
                <View style={styles.diffItem}>
                  <View style={styles.diffDot} />
                  <Text style={styles.diffItemText}>
                    {ageDiff ? (
                      ageDiff
                    ) : (
                      <Text style={styles.diffUnavailable}>
                        Edad: No disponible para calcular la diferencia.
                      </Text>
                    )}
                  </Text>
                </View>

                {/* Height diff */}
                <View style={styles.diffItem}>
                  <View style={styles.diffDot} />
                  <Text style={styles.diffItemText}>
                    {heightDiff ? (
                      heightDiff
                    ) : (
                      <Text style={styles.diffUnavailable}>
                        Estatura: No es posible calcular la diferencia porque falta el dato en uno
                        de los futbolistas.
                      </Text>
                    )}
                  </Text>
                </View>

                {/* Weight diff */}
                <View style={styles.diffItem}>
                  <View style={styles.diffDot} />
                  <Text style={styles.diffItemText}>
                    {weightDiff ? (
                      weightDiff
                    ) : (
                      <Text style={styles.diffUnavailable}>
                        Peso: No es posible calcular la diferencia porque falta el dato en uno de
                        los futbolistas.
                      </Text>
                    )}
                  </Text>
                </View>
              </View>

              {/* Neutrality Note */}
              <View style={styles.neutralityNote}>
                <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
                <Text style={styles.neutralityNoteText}>
                  La comparación describe diferencias físicas y de edad de forma neutral y
                  objetiva, sin declarar ganadores ni valorar que mayor peso, estatura o edad
                  implique superioridad deportiva.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
    paddingBottom: 110, // Sufficient bottom padding so content scrolls above tab bar
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  pageSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 17,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  clearAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    position: 'relative',
    marginBottom: SPACING.md,
  },
  slotCol: {
    width: '48%',
  },
  vsBadge: {
    position: 'absolute',
    left: '50%',
    top: 55,
    marginLeft: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...SHADOWS.card,
  },
  vsBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  slotCardEmpty: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    borderStyle: 'dashed',
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  slotBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.xs,
  },
  slotBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  slotNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  emptySlotIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  emptySlotTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptySlotSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: SPACING.xs,
    lineHeight: 15,
  },
  choosePlayerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
    minHeight: 44, // 44x44 minimum touch target
    justifyContent: 'center',
    width: '100%',
  },
  choosePlayerBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  slotCardOccupied: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: SPACING.sm,
    ...SHADOWS.card,
  },
  slotImageContainer: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  slotInfo: {
    paddingHorizontal: 2,
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  slotPlayerName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
    minHeight: 34,
  },
  slotTeamName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  slotActionsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    width: '100%',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  slotChangeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.sm,
    minHeight: 38,
  },
  slotChangeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  slotRemoveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: COLORS.errorBg,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.sm,
    minHeight: 38,
  },
  slotRemoveBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.errorText,
  },
  instructionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  instructionsIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  instructionsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  comparisonSection: {
    marginTop: SPACING.xs,
  },
  tableCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(23, 77, 56, 0.06)',
  },
  compSideValLeft: {
    flex: 1,
    alignItems: 'flex-start',
    paddingRight: SPACING.xs,
  },
  compCenterLabel: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  compLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  compSideValRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: SPACING.xs,
  },
  compValText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  summarySubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  diffItemsList: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  diffItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.secondary,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  diffDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  diffItemText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
    lineHeight: 18,
  },
  diffUnavailable: {
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  neutralityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  neutralityNoteText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});
