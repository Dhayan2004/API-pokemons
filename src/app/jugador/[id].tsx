import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lookupPlayerById } from '../../services/footballApi';
import { Player } from '../../types/player';
import { PositionBadge } from '../../components/PositionBadge';
import { EducationalPositionCard } from '../../components/EducationalPositionCard';
import { PlayerImage } from '../../components/PlayerImage';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { useComparison } from '../../context/ComparisonContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

export default function JugadorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectPlayer, whichSlot } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const data = await lookupPlayerById(id as string);
      if (data) {
        setPlayer(data);
      } else {
        setError('No se encontraron datos para este futbolista.');
      }
    } catch (err: any) {
      console.error('[JugadorDetailScreen] Fetch error:', err);
      setError(err?.message || 'Error al conectar con la API de TheSportsDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerDetail();
  }, [id]);

  const assignedSlot = player ? whichSlot(player.idPlayer) : null;
  const isFav = player ? isFavorite(player.idPlayer) : false;

  const handleComparePress = async () => {
    if (!player) return;
    if (assignedSlot !== null) {
      router.push('/(tabs)/comparar');
      return;
    }
    const res = await selectPlayer(player);
    if (!res.success && res.message) {
      showToast(res.message, 'warning');
    } else if (res.message) {
      showToast(res.message, 'success');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Ficha de Jugador
        </Text>
        {player ? (
          <TouchableOpacity
            style={styles.topBarFavBtn}
            onPress={() => toggleFavorite(player)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={24}
              color={isFav ? '#F87171' : COLORS.white}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>


      {loading ? (
        <LoadingState message="Cargando ficha detallada del futbolista..." />
      ) : error ? (
        <View style={styles.centerContainer}>
          <ErrorState
            title="Error de consulta"
            message={error}
            onRetry={fetchPlayerDetail}
          />
        </View>
      ) : player ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              {player.strNumber && (
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>#{player.strNumber}</Text>
                </View>
              )}

              <View style={styles.imageWrapper}>
                <PlayerImage
                  cutoutUrl={player.imageUrl}
                  thumbUrl={player.thumbUrl}
                  name={player.strPlayer}
                  number={player.strNumber}
                  height={195}
                />
              </View>

              <Text style={styles.playerName}>{player.strPlayer}</Text>

              <View style={styles.tagRow}>
                <PositionBadge
                  position={player.positionInfo.positionEs}
                  size="medium"
                />
                <View style={styles.nationalityTag}>
                  <Ionicons name="flag-outline" size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.nationalityText}>
                    {player.strNationality}
                  </Text>
                </View>
              </View>

              {/* Compare Action Button */}
              <TouchableOpacity
                style={[
                  styles.heroCompareBtn,
                  assignedSlot !== null && styles.heroCompareBtnActive,
                ]}
                onPress={handleComparePress}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={assignedSlot !== null ? 'checkmark-circle' : 'swap-horizontal'}
                  size={16}
                  color={assignedSlot !== null ? COLORS.primary : COLORS.textPrimary}
                />
                <Text
                  style={[
                    styles.heroCompareBtnText,
                    assignedSlot !== null && styles.heroCompareBtnTextActive,
                  ]}
                >
                  {assignedSlot !== null
                    ? `En Comparador (Jugador ${assignedSlot}) — Ver`
                    : 'Añadir a Comparar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>


          {/* Quick Stats Grid */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Datos Personales y Físicos</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Ionicons name="shirt-outline" size={18} color={COLORS.primary} />
                <Text style={styles.statLabel}>Equipo Actual</Text>
                <Text style={styles.statValue} numberOfLines={2}>
                  {player.strTeam}
                </Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                <Text style={styles.statLabel}>Nacimiento</Text>
                <Text style={styles.statValue}>
                  {player.dateBorn || 'No disponible'}
                </Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                <Text style={styles.statLabel}>Edad Calculada</Text>
                <Text style={styles.statValue}>
                  {player.age !== null ? `${player.age} años` : 'No disponible'}
                </Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="resize-outline" size={18} color={COLORS.primary} />
                <Text style={styles.statLabel}>Estatura</Text>
                <Text style={styles.statValue}>{player.formattedHeight}</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="fitness-outline" size={18} color={COLORS.primary} />
                <Text style={styles.statLabel}>Peso</Text>
                <Text style={styles.statValue}>{player.formattedWeight}</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="football-outline" size={18} color={COLORS.primary} />
                <Text style={styles.statLabel}>Posición API</Text>
                <Text style={styles.statValue} numberOfLines={1}>
                  {player.strPosition}
                </Text>
              </View>
            </View>
          </View>

          {/* Educational Position Explanation */}
          <EducationalPositionCard info={player.positionInfo} />

          {/* Biography / Description */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
              <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Reseña Biográfica</Text>
            </View>
            <Text style={styles.descriptionText}>{player.description}</Text>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  backText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  topBarFavBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  heroHeader: {
    alignItems: 'center',
    position: 'relative',
  },
  numberBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
    zIndex: 10,
  },
  numberText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  imageWrapper: {
    width: '100%',
    height: 210,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  playerImage: {
    width: '100%',
    height: '105%',
    transform: [{ translateY: 10 }],
  },
  playerName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: 4,
  },
  nationalityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  nationalityText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  heroCompareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.md,
    minHeight: 40,
  },
  heroCompareBtnActive: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  heroCompareBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  heroCompareBtnTextActive: {
    color: COLORS.primary,
  },
  sectionCard: {

    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACING.md,
  },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
