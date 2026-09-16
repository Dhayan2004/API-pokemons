import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lookupPlayerById } from '../../services/footballApi';
import { Player } from '../../types/player';
import { PositionBadge } from '../../components/PositionBadge';
import { EducationalPositionCard } from '../../components/EducationalPositionCard';
import { FallbackImage } from '../../components/FallbackImage';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

export default function JugadorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const fetchPlayerDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setImgError(false);

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
        <View style={{ width: 60 }} />
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
                {player.imageUrl && !imgError ? (
                  <Image
                    source={{ uri: player.imageUrl }}
                    style={styles.playerImage}
                    resizeMode="contain"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <FallbackImage
                    name={player.strPlayer}
                    number={player.strNumber}
                    height={180}
                  />
                )}
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
    height: 190,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  playerImage: {
    width: '100%',
    height: '100%',
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
