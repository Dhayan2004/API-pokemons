import { Player, TheSportsDBPlayer, APIPlayersResponse } from '../types/player';
import { normalizePlayer } from '../utils/playerData';
import { CATALOG_FALLBACK_DATA } from '../constants/featuredPlayers';

const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123';

/**
 * In-memory caches to prevent duplicate requests across screens.
 */
const playerCache = new Map<string, Player>();
const searchCache = new Map<string, Player[]>();

/**
 * Helper to construct a fallback Player object if network/API fails for a known catalog player.
 */
function getFallbackPlayer(id: string): Player | null {
  const fallback = CATALOG_FALLBACK_DATA[id];
  if (!fallback) return null;

  const rawFallback: TheSportsDBPlayer = {
    idPlayer: id,
    strPlayer: fallback.name,
    strTeam: fallback.team,
    strPosition: fallback.position,
    strNationality: fallback.nationality,
    dateBorn: fallback.dateBorn,
    strHeight: fallback.height,
    strWeight: fallback.weight,
    strNumber: fallback.number,
    strCutout: fallback.imageUrl,
    strDescriptionES: fallback.descriptionEs,
    strSport: 'Soccer',
  };

  return normalizePlayer(rawFallback, true);
}

/**
 * Lookup a player by their ID from TheSportsDB v1 API.
 * Uses in-memory cache if already fetched with complete details.
 * Falls back gracefully to verified catalog data if rate limited.
 */
export async function lookupPlayerById(id: string, forceRefresh = false): Promise<Player | null> {
  if (!id) return null;

  // Check cache first: if already complete and not forcing refresh, return cached
  const cached = playerCache.get(id);
  if (cached && cached.isComplete && !forceRefresh) {
    return cached;
  }

  try {
    const url = `${API_BASE_URL}/lookupplayer.php?id=${encodeURIComponent(id)}`;
    const response = await fetch(url);

    if (!response.ok) {
      const fallback = getFallbackPlayer(id);
      if (fallback) {
        playerCache.set(id, fallback);
        return fallback;
      }
      if (response.status === 429) {
        throw new Error('Límite de solicitudes de la API alcanzado. Espera un momento.');
      }
      throw new Error(`Error de red HTTP: ${response.status}`);
    }

    const text = await response.text();
    // Guard against non-JSON responses (e.g. Cloudflare error 1015)
    if (!text.trim().startsWith('{')) {
      const fallback = getFallbackPlayer(id);
      if (fallback) {
        playerCache.set(id, fallback);
        return fallback;
      }
      throw new Error('Respuesta inválida del servidor.');
    }

    const data: APIPlayersResponse = JSON.parse(text);

    if (data && data.players && data.players.length > 0) {
      const rawPlayer = data.players[0];
      const player = normalizePlayer(rawPlayer, true);
      playerCache.set(id, player);
      return player;
    }

    // Fallback data if API returned empty for catalog player
    const fallback = getFallbackPlayer(id);
    if (fallback) {
      playerCache.set(id, fallback);
      return fallback;
    }

    return null;
  } catch (error) {
    // If fetch failed, fallback if available
    const fallback = getFallbackPlayer(id);
    if (fallback) {
      playerCache.set(id, fallback);
      return fallback;
    }

    throw error;
  }
}

/**
 * Ensures a player object has full physical and biographical details.
 * If player came from a search result without height or weight, fetches full record via lookup.
 */
export async function ensureCompletePlayer(player: Player): Promise<Player> {
  if (player.isComplete || (player.heightCm !== null && player.weightKg !== null)) {
    return player;
  }

  try {
    const full = await lookupPlayerById(player.idPlayer);
    return full || player;
  } catch (err) {
    console.warn(`[footballApi] Could not enrich player ${player.idPlayer}:`, err);
    return player;
  }
}

/**
 * Fetches multiple players concurrently by ID with cache prioritization and fallback safety.
 */
export async function fetchPlayersBatch(ids: string[]): Promise<{
  players: Record<string, Player>;
  errors: Record<string, string>;
}> {
  const players: Record<string, Player> = {};
  const errors: Record<string, string> = {};

  await Promise.all(
    ids.map(async (id) => {
      try {
        const player = await lookupPlayerById(id);
        if (player) {
          players[id] = player;
        } else {
          errors[id] = 'Jugador no encontrado en la API';
        }
      } catch (err: any) {
        errors[id] = err?.message || 'Error al conectar con la API';
      }
    })
  );

  return { players, errors };
}

/**
 * Alias for backward compatibility
 */
export const fetchFeaturedPlayers = fetchPlayersBatch;

/**
 * Search players by name.
 * - Encodes query spaces with '_' as documented by TheSportsDB.
 * - Filters strictly for Soccer players.
 * - Does NOT overwrite cached complete players with summarized ones.
 * - Free tier returns at most 1 player; handles null/empty safely.
 */
export async function searchPlayersByName(query: string): Promise<Player[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const cacheKey = cleanQuery.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  try {
    const formattedQuery = cleanQuery.replace(/\s+/g, '_');
    const url = `${API_BASE_URL}/searchplayers.php?p=${encodeURIComponent(formattedQuery)}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Límite de solicitudes de la API alcanzado. Espera unos segundos e inténtalo de nuevo.');
      }
      throw new Error(`Error en búsqueda HTTP: ${response.status}`);
    }

    const text = await response.text();
    if (!text.trim().startsWith('{')) {
      throw new Error('Límite de solicitudes o respuesta no válida.');
    }

    const data: APIPlayersResponse = JSON.parse(text);
    const rawList = data?.player || data?.players || [];

    if (!rawList || !Array.isArray(rawList)) {
      searchCache.set(cacheKey, []);
      return [];
    }

    // Filter strictly for Soccer players
    const soccerPlayers = rawList
      .filter((p) => p && (!p.strSport || p.strSport.toLowerCase() === 'soccer'))
      .map((p) => normalizePlayer(p, false));

    // Update individual playerCache WITHOUT downgrading already complete entries
    soccerPlayers.forEach((p) => {
      if (p.idPlayer) {
        const existing = playerCache.get(p.idPlayer);
        if (!existing || !existing.isComplete) {
          playerCache.set(p.idPlayer, p);
        }
      }
    });

    searchCache.set(cacheKey, soccerPlayers);
    return soccerPlayers;
  } catch (error) {
    console.error(`[footballApi] Search failed for query "${query}":`, error);
    throw error;
  }
}

/**
 * Clears in-memory caches.
 */
export function clearFootballCache(): void {
  playerCache.clear();
  searchCache.clear();
}
