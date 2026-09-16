import { Player, TheSportsDBPlayer, APIPlayersResponse } from '../types/player';
import { normalizePlayer } from '../utils/playerData';
import { FEATURED_FALLBACK_DATA } from '../constants/featuredPlayers';

const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123';

/**
 * Simple in-memory cache to prevent duplicate requests across screens.
 */
const playerCache = new Map<string, Player>();
const searchCache = new Map<string, Player[]>();

/**
 * Helper to construct a fallback Player object if network/API fails for a known featured player.
 */
function getFallbackPlayer(id: string): Player | null {
  const fallback = FEATURED_FALLBACK_DATA[id];
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

  return normalizePlayer(rawFallback);
}

/**
 * Lookup a player by their ID from TheSportsDB v1 API.
 * Uses in-memory cache if already fetched.
 */
export async function lookupPlayerById(id: string): Promise<Player | null> {
  if (!id) return null;

  // Check cache first
  if (playerCache.has(id)) {
    return playerCache.get(id)!;
  }

  try {
    const url = `${API_BASE_URL}/lookupplayer.php?id=${encodeURIComponent(id)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error de red HTTP: ${response.status}`);
    }

    const data: APIPlayersResponse = await response.json();

    if (data && data.players && data.players.length > 0) {
      const rawPlayer = data.players[0];
      const player = normalizePlayer(rawPlayer);
      playerCache.set(id, player);
      return player;
    }

    // Try fallback data if API returned null for featured player
    const fallback = getFallbackPlayer(id);
    if (fallback) {
      playerCache.set(id, fallback);
      return fallback;
    }

    return null;
  } catch (error) {
    console.warn(`[footballApi] Failed to lookup player ID ${id}:`, error);

    // If fetch failed (e.g. offline/rate-limit), fallback if available
    const fallback = getFallbackPlayer(id);
    if (fallback) {
      playerCache.set(id, fallback);
      return fallback;
    }

    throw error;
  }
}

/**
 * Fetches multiple featured players concurrently by ID.
 * Returns both successfully loaded players and error maps for failed items.
 */
export async function fetchFeaturedPlayers(ids: string[]): Promise<{
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
 * Search players by name (Prepared for Stage 2 - Buscador).
 * Filters results for Soccer sport and caches query.
 */
export async function searchPlayersByName(query: string): Promise<Player[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  if (searchCache.has(cleanQuery)) {
    return searchCache.get(cleanQuery)!;
  }

  try {
    const formattedQuery = cleanQuery.replace(/\s+/g, '_');
    const url = `${API_BASE_URL}/searchplayers.php?p=${encodeURIComponent(formattedQuery)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error en búsqueda HTTP: ${response.status}`);
    }

    const data: APIPlayersResponse = await response.json();
    const rawList = data.player || data.players || [];

    // Filter only Soccer players
    const soccerPlayers = rawList
      .filter((p) => !p.strSport || p.strSport.toLowerCase() === 'soccer')
      .map(normalizePlayer);

    // Populate individual cache
    soccerPlayers.forEach((p) => {
      if (p.idPlayer) playerCache.set(p.idPlayer, p);
    });

    searchCache.set(cleanQuery, soccerPlayers);
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
