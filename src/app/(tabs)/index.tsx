import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBanner } from '../../components/HeaderBanner';
import { PlayerCard } from '../../components/PlayerCard';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { Player } from '../../types/player';
import {
  fetchPlayersBatch,
  lookupPlayerById,
  searchPlayersByName,
} from '../../services/footballApi';
import {
  CATALOG_PLAYERS,
  CatalogItem,
  PositionCategory,
} from '../../constants/featuredPlayers';
import { useComparison } from '../../context/ComparisonContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

type ActiveMainTab = 'catalogo' | 'favoritos';
type PositionFilter = 'Todos' | 'Porteros' | 'Defensas' | 'Mediocampistas' | 'Delanteros';

const POSITION_FILTERS: PositionFilter[] = [
  'Todos',
  'Porteros',
  'Defensas',
  'Mediocampistas',
  'Delanteros',
];

function matchPositionCategory(playerCategory: string, filter: PositionFilter): boolean {
  if (filter === 'Todos') return true;
  const cat = playerCategory.toLowerCase();
  if (filter === 'Porteros') return cat.includes('porter') || cat.includes('keeper');
  if (filter === 'Defensas') return cat.includes('defens') || cat.includes('back');
  if (filter === 'Mediocampistas') return cat.includes('centrocampista') || cat.includes('medio') || cat.includes('midfield');
  if (filter === 'Delanteros') return cat.includes('delanter') || cat.includes('wing') || cat.includes('forward') || cat.includes('striker');
  return false;
}

export default function HomeScreen() {
  const router = useRouter();
  const { selectingSlot, cancelSelecting } = useComparison();
  const { favorites } = useFavorites();
  const { showToast } = useToast();

  // Mode switcher: Catálogo vs Favoritos
  const [activeTab, setActiveTab] = useState<ActiveMainTab>('catalogo');
  const [selectedFilter, setSelectedFilter] = useState<PositionFilter>('Todos');

  // Loaded player objects store
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Progressive block loading count (6 in 6: 6 -> 12 -> 18 -> 24)
  const [visibleCount, setVisibleCount] = useState(6);

  // Integrated Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSearchTerm, setActiveSearchTerm] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Concurrency refs
  const searchRequestIdRef = useRef(0);
  const filterRequestIdRef = useRef(0);

  // Filter catalog items according to selected position filter
  const filteredCatalogItems = useMemo(() => {
    if (selectedFilter === 'Todos') return CATALOG_PLAYERS;
    return CATALOG_PLAYERS.filter((item) => matchPositionCategory(item.category, selectedFilter));
  }, [selectedFilter]);

  // Filter saved favorites according to selected position filter
  const filteredFavorites = useMemo(() => {
    if (selectedFilter === 'Todos') return favorites;
    return favorites.filter((p) => matchPositionCategory(p.positionInfo.category, selectedFilter));
  }, [favorites, selectedFilter]);

  // Load players batch for visible catalog items
  const loadCatalogBatch = useCallback(
    async (itemsToFetch: CatalogItem[], isRefresh = false) => {
      const currentRequestId = ++filterRequestIdRef.current;
      if (isRefresh) {
        setRefreshing(true);
      } else if (Object.keys(players).length === 0) {
        setLoadingInitial(true);
      }

      try {
        const ids = itemsToFetch.map((it) => it.id);
        const result = await fetchPlayersBatch(ids);

        if (filterRequestIdRef.current !== currentRequestId) return;

        setPlayers((prev) => ({ ...prev, ...result.players }));
        setErrors((prev) => ({ ...prev, ...result.errors }));
      } catch (err: any) {
        console.error('[HomeScreen] Error loading catalog batch:', err);
      } finally {
        if (filterRequestIdRef.current === currentRequestId) {
          setLoadingInitial(false);
          setRefreshing(false);
          setLoadingMore(false);
        }
      }
    },
    [players]
  );

  // Initial load: fetch the first 6 players of the catalog
  useEffect(() => {
    const initialItems = CATALOG_PLAYERS.slice(0, 6);
    loadCatalogBatch(initialItems);
  }, []);

  // When position filter changes, reset visible count to 6 and load first block if needed
  const handleFilterChange = (filter: PositionFilter) => {
    setSelectedFilter(filter);
    setVisibleCount(6);

    if (activeTab === 'catalogo') {
      const newItems = CATALOG_PLAYERS.filter((it) => matchPositionCategory(it.category, filter));
      const firstBlock = newItems.slice(0, 6);
      loadCatalogBatch(firstBlock);
    }
  };

  // When switching between Catálogo and Favoritos
  const handleTabChange = (tab: ActiveMainTab) => {
    setActiveTab(tab);
    handleClearSearch();
    setSelectedFilter('Todos');
    setVisibleCount(6);

    if (tab === 'catalogo') {
      const firstBlock = CATALOG_PLAYERS.slice(0, 6);
      loadCatalogBatch(firstBlock);
    }
  };

  // "Ver más" block pagination (increments by 6)
  const handleLoadMore = async () => {
    if (loadingMore) return;

    if (activeTab === 'catalogo') {
      const maxAvailable = filteredCatalogItems.length;
      if (visibleCount >= maxAvailable) return;

      const nextCount = Math.min(visibleCount + 6, maxAvailable);
      const nextBatchItems = filteredCatalogItems.slice(visibleCount, nextCount);

      setLoadingMore(true);
      await loadCatalogBatch(nextBatchItems);
      setVisibleCount(nextCount);
    } else {
      // In Favoritos
      const maxAvailable = filteredFavorites.length;
      if (visibleCount >= maxAvailable) return;
      setVisibleCount((prev) => Math.min(prev + 6, maxAvailable));
    }
  };

  const handleRetrySingle = async (id: string) => {
    setRetryingId(id);
    try {
      const player = await lookupPlayerById(id, true);
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

  // Search submit
  const executeSearch = async (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    Keyboard.dismiss();
    const requestId = ++searchRequestIdRef.current;

    setSearching(true);
    setSearchError(null);
    setActiveSearchTerm(cleanTerm);
    setHasSearched(true);

    try {
      const results = await searchPlayersByName(cleanTerm);
      if (searchRequestIdRef.current !== requestId) return;
      setSearchResults(results);
    } catch (err: any) {
      if (searchRequestIdRef.current !== requestId) return;
      setSearchError(err?.message || 'Error al conectar con la API de TheSportsDB.');
    } finally {
      if (searchRequestIdRef.current === requestId) {
        setSearching(false);
      }
    }
  };

  const handleSearchPress = () => {
    if (!searchQuery.trim()) return;
    executeSearch(searchQuery);
  };

  const handleClearSearch = () => {
    searchRequestIdRef.current++;
    setSearchQuery('');
    setActiveSearchTerm(null);
    setSearchResults([]);
    setSearchError(null);
    setSearching(false);
    setHasSearched(false);
    Keyboard.dismiss();
  };

  const isSearchActive = hasSearched && activeSearchTerm !== null;

  // Render Catalog player card item
  const renderCatalogItem = ({
    item,
  }: {
    item: { id: string; player: Player | null; error: string | null };
  }) => {
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

  // Render Search / Favorite Player Card
  const renderPlayerItem = ({ item }: { item: Player }) => {
    return (
      <View style={styles.gridColumn}>
        <PlayerCard
          player={item}
          onPress={() => router.push(`/jugador/${item.idPlayer}`)}
        />
      </View>
    );
  };

  // Prepare visible list data for Catalog
  const visibleCatalogList = useMemo(() => {
    const visibleSlice = filteredCatalogItems.slice(0, visibleCount);
    return visibleSlice.map((item) => ({
      id: item.id,
      player: players[item.id] || null,
      error: errors[item.id] || null,
    }));
  }, [filteredCatalogItems, visibleCount, players, errors]);

  // Prepare visible list data for Favorites
  const visibleFavoritesList = useMemo(() => {
    return filteredFavorites.slice(0, visibleCount);
  }, [filteredFavorites, visibleCount]);

  const totalInCatalogGroup = filteredCatalogItems.length;
  const shownInCatalogGroup = Math.min(visibleCount, totalInCatalogGroup);
  const hasMoreCatalog = shownInCatalogGroup < totalInCatalogGroup;

  const totalInFavGroup = filteredFavorites.length;
  const shownInFavGroup = Math.min(visibleCount, totalInFavGroup);
  const hasMoreFavorites = shownInFavGroup < totalInFavGroup;

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBanner subtitle="Conoce a quienes hacen el juego" />

      {/* Selection Mode Banner */}
      {selectingSlot !== null && (
        <View style={styles.selectionModeBanner}>
          <View style={styles.selectionBannerTextRow}>
            <Ionicons name="swap-horizontal" size={18} color={COLORS.primary} />
            <Text style={styles.selectionBannerTitle}>
              Selecciona al Jugador {selectingSlot}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cancelSelectionBtn}
            onPress={cancelSelecting}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelSelectionText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Integrated Search Box */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchInputContainer,
            isSearchFocused && styles.searchInputContainerFocused,
          ]}
        >
          <TextInput
            style={[
              styles.searchInput,
              Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
            ]}
            placeholder="Busca un futbolista..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onSubmitEditing={handleSearchPress}
            returnKeyType="search"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSearch}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
              accessibilityLabel="Limpiar texto de búsqueda"
            >
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.searchIconButton,
              !searchQuery.trim() && styles.searchIconButtonDisabled,
            ]}
            onPress={handleSearchPress}
            disabled={!searchQuery.trim()}
            activeOpacity={0.8}
            accessibilityLabel="Buscar"
          >
            <Ionicons name="search" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.searchHint}>
          💡 Prueba con el nombre completo, por ejemplo: Lionel Messi
        </Text>
      </View>

      {/* Compact Switcher: Catálogo | Favoritos (hidden during active search) */}
      {!isSearchActive && (
        <View style={styles.tabSwitcherSection}>
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              style={[
                styles.tabSwitchButton,
                activeTab === 'catalogo' && styles.tabSwitchButtonActive,
              ]}
              onPress={() => handleTabChange('catalogo')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="grid-outline"
                size={15}
                color={activeTab === 'catalogo' ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.tabSwitchText,
                  activeTab === 'catalogo' && styles.tabSwitchTextActive,
                ]}
              >
                Catálogo (24)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabSwitchButton,
                activeTab === 'favoritos' && styles.tabSwitchButtonActive,
              ]}
              onPress={() => handleTabChange('favoritos')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={favorites.length > 0 ? 'heart' : 'heart-outline'}
                size={15}
                color={activeTab === 'favoritos' ? '#E02424' : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.tabSwitchText,
                  activeTab === 'favoritos' && styles.tabSwitchTextActive,
                ]}
              >
                Favoritos ({favorites.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Horizontal Position Filter Pills (hidden during active search) */}
      {!isSearchActive && (
        <View style={styles.filterBarWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsContainer}
          >
            {POSITION_FILTERS.map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                  ]}
                  onPress={() => handleFilterChange(filter)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextSelected,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContainer}>
        {isSearchActive ? (
          // Search Results View
          searching ? (
            <LoadingState message={`Buscando "${activeSearchTerm}" en TheSportsDB...`} />
          ) : searchError ? (
            <ErrorState
              title="Error en la búsqueda"
              message={searchError}
              onRetry={() => executeSearch(activeSearchTerm)}
            />
          ) : searchResults.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={42} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>Sin resultados encontrados</Text>
              <Text style={styles.emptyMessage}>
                No encontramos coincidencias para "{activeSearchTerm}". La API gratuita de
                TheSportsDB documenta un máximo de 1 resultado por búsqueda y requiere nombres
                específicos.
              </Text>
              <Text style={styles.emptyTip}>
                Sugerencia: Comprueba la ortografía y utiliza el nombre completo (ej: Cristiano
                Ronaldo, Neymar, Luka Modric).
              </Text>
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={handleClearSearch}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-undo-outline" size={16} color={COLORS.white} />
                <Text style={styles.restoreButtonText}>Restaurar futbolistas del catálogo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.idPlayer}
              renderItem={renderPlayerItem}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Resultados de búsqueda</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>
                        {searchResults.length}{' '}
                        {searchResults.length === 1 ? 'resultado' : 'resultados'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.activeQueryRow}>
                    <Text style={styles.sectionSubtitle}>
                      Búsqueda: "{activeSearchTerm}" • Datos de TheSportsDB
                    </Text>
                    <TouchableOpacity
                      style={styles.inlineRestoreLink}
                      onPress={handleClearSearch}
                    >
                      <Text style={styles.inlineRestoreText}>Volver al catálogo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
            />
          )
        ) : activeTab === 'favoritos' ? (
          // Favorites Tab View
          favorites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="heart-outline" size={42} color="#E02424" />
              </View>
              <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
              <Text style={styles.emptyMessage}>
                Guarda tus futbolistas preferidos tocando el icono de corazón en cualquiera de las
                tarjetas del catálogo, en los resultados de búsqueda o en su ficha de detalle.
              </Text>
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={() => handleTabChange('catalogo')}
                activeOpacity={0.8}
              >
                <Ionicons name="grid-outline" size={16} color={COLORS.white} />
                <Text style={styles.restoreButtonText}>Explorar catálogo</Text>
              </TouchableOpacity>
            </View>
          ) : filteredFavorites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="filter-outline" size={36} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>Sin favoritos en esta posición</Text>
              <Text style={styles.emptyMessage}>
                No tienes futbolistas guardados en la categoría "{selectedFilter}".
              </Text>
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={() => setSelectedFilter('Todos')}
                activeOpacity={0.8}
              >
                <Text style={styles.restoreButtonText}>Ver todos los favoritos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={visibleFavoritesList}
              keyExtractor={(item) => item.idPlayer}
              renderItem={renderPlayerItem}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Tus Futbolistas Favoritos</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>
                        Mostrando {shownInFavGroup} de {totalInFavGroup}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.sectionSubtitle}>
                    Guardados en la memoria del dispositivo. Se conservan al cerrar la app.
                  </Text>
                </View>
              }
              ListFooterComponent={
                hasMoreFavorites ? (
                  <View style={styles.loadMoreWrapper}>
                    <TouchableOpacity
                      style={styles.loadMoreBtn}
                      onPress={handleLoadMore}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
                      <Text style={styles.loadMoreText}>Ver más favoritos (+6)</Text>
                    </TouchableOpacity>
                  </View>
                ) : null
              }
            />
          )
        ) : (
          // Catalog Tab View
          loadingInitial && Object.keys(players).length === 0 ? (
            <LoadingState message="Cargando catálogo de futbolistas..." />
          ) : (
            <FlatList
              data={visibleCatalogList}
              keyExtractor={(item) => item.id}
              renderItem={renderCatalogItem}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => loadCatalogBatch(filteredCatalogItems.slice(0, visibleCount), true)}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
              ListHeaderComponent={
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Explora futbolistas</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>
                        Mostrando {shownInCatalogGroup} de {totalInCatalogGroup}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.sectionSubtitle}>
                    {selectedFilter === 'Todos'
                      ? 'Catálogo de 24 futbolistas internacionales ordenados por posición.'
                      : `Selección verificada de ${selectedFilter} en el catálogo.`}
                  </Text>
                </View>
              }
              ListFooterComponent={
                hasMoreCatalog ? (
                  <View style={styles.loadMoreWrapper}>
                    <TouchableOpacity
                      style={[styles.loadMoreBtn, loadingMore && styles.loadMoreBtnDisabled]}
                      onPress={handleLoadMore}
                      disabled={loadingMore}
                      activeOpacity={0.8}
                    >
                      {loadingMore ? (
                        <>
                          <ActivityIndicator size="small" color={COLORS.primary} />
                          <Text style={[styles.loadMoreText, { marginLeft: 8 }]}>
                            Cargando siguientes 6...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Ionicons name="arrow-down-circle-outline" size={18} color={COLORS.primary} />
                          <Text style={styles.loadMoreText}>
                            Ver más futbolistas ({shownInCatalogGroup + 1}-
                            {Math.min(shownInCatalogGroup + 6, totalInCatalogGroup)})
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : null
              }
            />
          )
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
  selectionModeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentDark,
  },
  selectionBannerTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectionBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  cancelSelectionBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    minHeight: 32,
    justifyContent: 'center',
  },
  cancelSelectionText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  searchSection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    ...SHADOWS.card,
  },
  searchInputContainerFocused: {
    borderColor: COLORS.primary,
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 3px rgba(23, 77, 56, 0.15)',
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minHeight: 44,
  },
  clearButton: {
    padding: SPACING.xs,
    marginRight: SPACING.xs,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  searchHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  tabSwitcherSection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E8ECE9',
    borderRadius: BORDER_RADIUS.md,
    padding: 3,
  },
  tabSwitchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.sm,
  },
  tabSwitchButtonActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.card,
  },
  tabSwitchText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabSwitchTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  filterBarWrapper: {
    paddingVertical: SPACING.xs + 2,
  },
  filterChipsContainer: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs + 2,
  },
  filterChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextSelected: {
    color: COLORS.white,
    fontWeight: '800',
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 120, // Generous padding so cards and 'Ver más' scroll fully clear of bottom tab bar
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
  activeQueryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  inlineRestoreLink: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  inlineRestoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  loadMoreWrapper: {
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.full,
    minHeight: 46,
    width: '100%',
    ...SHADOWS.card,
  },
  loadMoreBtnDisabled: {
    opacity: 0.7,
  },
  loadMoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 6,
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
    minHeight: 32,
    justifyContent: 'center',
  },
  retryText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: SPACING.md,
  },
  emptyTip: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: SPACING.lg,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    minHeight: 44,
  },
  restoreButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
