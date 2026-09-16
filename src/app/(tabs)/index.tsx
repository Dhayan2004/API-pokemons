import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBanner } from '../../components/HeaderBanner';
import { PlayerCard } from '../../components/PlayerCard';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { Player } from '../../types/player';
import { fetchFeaturedPlayers, lookupPlayerById } from '../../services/footballApi';
import { FEATURED_PLAYER_IDS } from '../../constants/featuredPlayers';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await fetchFeaturedPlayers(FEATURED_PLAYER_IDS);
      setPlayers(result.players);
      setErrors(result.errors);
    } catch (err: any) {
      console.error('[HomeScreen] General load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRetrySingle = async (id: string) => {
    setRetryingId(id);
    try {
      const player = await lookupPlayerById(id);
      if (player) {
        setPlayers((prev) => ({ ...prev, [id]: player }));
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    } catch (err: any) {
      console.warn(`[HomeScreen] Retry failed for ${id}:`, err);
    } finally {
      setRetryingId(null);
    }
  };

  const loadedPlayerList = FEATURED_PLAYER_IDS.map((id) => ({
    id,
    player: players[id] || null,
    error: errors[id] || null,
  }));

  const renderItem = ({ item }: { item: { id: string; player: Player | null; error: string | null } }) => {
    if (item.player) {
      return (
        <View style={styles.gridColumn}>
          <PlayerCard
            player={item.player}
            onPress={() => router.push(`/jugador/${item.player!.idPlayer}`)}
          />
        </View>
      );
    }

    return (
      <View style={styles.gridColumn}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Error al cargar</Text>
          <Text style={styles.errorSub} numberOfLines={2}>
            {item.error || 'No se pudo obtener datos'}
          </Text>
          <TouchableOpacity
            style={styles.retryBadge}
            onPress={() => handleRetrySingle(item.id)}
            disabled={retryingId === item.id}
          >
            <Text style={styles.retryText}>
              {retryingId === item.id ? 'Cargando...' : 'Reintentar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const hasAnyLoaded = Object.keys(players).length > 0;
  const hasGlobalError = !loading && !hasAnyLoaded && Object.keys(errors).length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBanner subtitle="Conoce a quienes hacen el juego" />

      <View style={styles.mainContainer}>
        {loading && !refreshing && Object.keys(players).length === 0 ? (
          <LoadingState message="Obteniendo la selección editorial de futbolistas..." />
        ) : hasGlobalError ? (
          <ErrorState
            title="Error de conexión"
            message="No se pudieron cargar las fichas de los futbolistas desde TheSportsDB."
            onRetry={() => loadData()}
          />
        ) : (
          <FlatList
            data={loadedPlayerList}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadData(true)}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            ListHeaderComponent={
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>Selección Destacada</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>
                      {Object.keys(players).length} / {FEATURED_PLAYER_IDS.length}
                    </Text>
                  </View>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Selección de 6 futbolistas internacionales consultados en tiempo real.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridColumn: {
    width: '48.5%',
  },
  sectionHeader: {
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  countBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  errorCard: {
    backgroundColor: COLORS.errorBg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.errorText,
    marginBottom: 4,
  },
  errorSub: {
    fontSize: 11,
    color: '#7F1D1D',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  retryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
