/**
 * TypeScript interface definitions for Futbolista app.
 */

// Raw player interface returned by TheSportsDB API v1
export interface TheSportsDBPlayer {
  idPlayer: string;
  strPlayer: string;
  strPlayerAlternate?: string | null;
  strNationality?: string | null;
  strTeam?: string | null;
  strSport?: string | null;
  dateBorn?: string | null;
  strPosition?: string | null;
  strHeight?: string | null;
  strWeight?: string | null;
  strThumb?: string | null;
  strCutout?: string | null;
  strRender?: string | null;
  strFanart1?: string | null;
  strDescriptionES?: string | null;
  strDescriptionEN?: string | null;
  strNumber?: string | null;
  strSide?: string | null;
  strBirthLocation?: string | null;
  strStatus?: string | null;
}

// Educational tactical info for position
export interface PositionEducationalInfo {
  positionEs: string;
  category: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';
  descriptionEs: string;
}

// Normalized Player interface used throughout the app
export interface Player {
  idPlayer: string;
  strPlayer: string;
  strNationality: string; // "No disponible" if null
  strTeam: string;        // "No disponible" if null
  dateBorn: string | null;
  age: number | null;     // Calculated completed years
  strPosition: string;    // Raw position from API or "No disponible"
  positionInfo: PositionEducationalInfo;
  heightCm: number | null;
  formattedHeight: string; // e.g. "170 cm" or "No disponible"
  weightKg: number | null;
  formattedWeight: string; // e.g. "74 kg" or "No disponible"
  imageUrl: string | null;  // Cutout > Render > Thumb
  thumbUrl: string | null;
  description: string;      // ES description or EN or default fallback message
  strNumber: string | null;
  isComplete?: boolean;     // True if loaded from lookupplayer (has physical data/full description)
}

// Search / Featured API Response wrapper (TheSportsDB v1 returns 'player' on search and 'players' on lookup)
export interface APIPlayersResponse {
  players?: TheSportsDBPlayer[] | null;
  player?: TheSportsDBPlayer[] | null;
}

// Per-player fetch status for initial load & retry logic
export interface PlayerFetchResult {
  id: string;
  player: Player | null;
  error: string | null;
  loading: boolean;
}

