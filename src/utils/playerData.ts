import { PositionEducationalInfo, Player, TheSportsDBPlayer } from '../types/player';

/**
 * Calculates full completed age from birth date string (YYYY-MM-DD).
 */
export function calculateAge(dateBornStr?: string | null): number | null {
  if (!dateBornStr || typeof dateBornStr !== 'string') return null;

  const parts = dateBornStr.trim().split('-');
  if (parts.length < 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed in JS Date
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  const birthDate = new Date(year, month, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 && age < 100 ? age : null;
}

/**
 * Normalizes raw height string from API to centimeters.
 * Examples handled:
 * - "188 cm" -> 188
 * - "1.70 m (5 ft 7 in)" -> 170
 * - "1.78 m" -> 178
 * - "176cm / 5'9"" -> 176
 * - "6 ft 2 in" -> 188
 */
export function parseHeightCm(strHeight?: string | null): number | null {
  if (!strHeight || typeof strHeight !== 'string') return null;
  const str = strHeight.trim().toLowerCase();
  if (str === '' || str === '0' || str.includes('null') || str.includes('n/a')) return null;

  // Case 1: Meter format e.g. "1.70 m", "1.78m"
  const metersMatch = str.match(/(\d+\.\d+)\s*m/);
  if (metersMatch) {
    const meters = parseFloat(metersMatch[1]);
    if (!isNaN(meters) && meters > 1.2 && meters < 2.5) {
      return Math.round(meters * 100);
    }
  }

  // Case 2: Direct centimeters e.g. "188 cm", "176cm"
  const cmMatch = str.match(/(\d{3})\s*cm/);
  if (cmMatch) {
    const cm = parseInt(cmMatch[1], 10);
    if (!isNaN(cm) && cm > 120 && cm < 230) {
      return cm;
    }
  }

  // Case 3: Imperial feet & inches e.g. "5 ft 10 in" or "6'2"
  const ftInMatch = str.match(/(\d+)\s*(?:ft|')\s*(\d+)?/);
  if (ftInMatch) {
    const feet = parseInt(ftInMatch[1], 10);
    const inches = ftInMatch[2] ? parseInt(ftInMatch[2], 10) : 0;
    if (!isNaN(feet) && feet >= 4 && feet <= 7) {
      const totalInches = feet * 12 + inches;
      return Math.round(totalInches * 2.54);
    }
  }

  // Case 4: Plain number string e.g. "188" or "1.88"
  const plainNum = parseFloat(str.replace(/[^\d.]/g, ''));
  if (!isNaN(plainNum)) {
    if (plainNum > 1.2 && plainNum < 2.5) return Math.round(plainNum * 100);
    if (plainNum > 120 && plainNum < 230) return Math.round(plainNum);
  }

  return null;
}

/**
 * Normalizes raw weight string from API to kilograms.
 * Examples handled:
 * - "85 kg" -> 85
 * - "148 lbs", "183 lb" -> Math.round(183 * 0.453592) = 83
 * - "163 lb (74 kg)" -> 74
 */
export function parseWeightKg(strWeight?: string | null): number | null {
  if (!strWeight || typeof strWeight !== 'string') return null;
  const str = strWeight.trim().toLowerCase();
  if (str === '' || str === '0' || str.includes('null') || str.includes('n/a')) return null;

  // Case 1: Explicit kg in parentheses or string e.g. "(74 kg)" or "85 kg"
  const kgMatch = str.match(/(\d+)\s*kg/);
  if (kgMatch) {
    const kg = parseInt(kgMatch[1], 10);
    if (!isNaN(kg) && kg > 40 && kg < 140) {
      return kg;
    }
  }

  // Case 2: Pounds e.g. "148 lbs", "183 lb"
  const lbsMatch = str.match(/(\d+)\s*lb/);
  if (lbsMatch) {
    const lbs = parseInt(lbsMatch[1], 10);
    if (!isNaN(lbs) && lbs > 90 && lbs < 300) {
      return Math.round(lbs * 0.453592);
    }
  }

  // Case 3: Plain number e.g. "74" or "165"
  const plainNum = parseInt(str.replace(/[^\d]/g, ''), 10);
  if (!isNaN(plainNum)) {
    if (plainNum > 40 && plainNum <= 130) return plainNum;
    if (plainNum > 130 && plainNum < 300) return Math.round(plainNum * 0.453592);
  }

  return null;
}

export function formatHeight(strHeight?: string | null): string {
  const cm = parseHeightCm(strHeight);
  return cm ? `${cm} cm` : 'No disponible';
}

export function formatWeight(strWeight?: string | null): string {
  const kg = parseWeightKg(strWeight);
  return kg ? `${kg} kg` : 'No disponible';
}

/**
 * Educational breakdown of player positions in Spanish.
 */
export function getPositionEducationalInfo(strPosition?: string | null): PositionEducationalInfo {
  const pos = (strPosition || '').toLowerCase();

  if (pos.includes('goalkeeper') || pos.includes('keeper') || pos.includes('portero')) {
    return {
      positionEs: 'Guardameta / Portero',
      category: 'Portero',
      descriptionEs: 'Único jugador del equipo autorizado a usar las manos dentro de su área. Su objetivo principal es evitar que el balón entre en la portería y dirigir la línea defensiva.',
    };
  }

  if (pos.includes('back') || pos.includes('defender') || pos.includes('centre-back') || pos.includes('defensa')) {
    return {
      positionEs: 'Defensa / Zaguero',
      category: 'Defensa',
      descriptionEs: 'Responsable de neutralizar las jugadas de ataque del rival, recuperar la posesión, cortar pases filtrados y reiniciar la construcción del juego desde la zona posterior.',
    };
  }

  if (pos.includes('midfield') || pos.includes('medio') || pos.includes('volante') || pos.includes('central midfield') || pos.includes('attacking midfield')) {
    return {
      positionEs: 'Centrocampista / Mediocampista',
      category: 'Centrocampista',
      descriptionEs: 'Eje táctico de transición. Conecta la línea defensiva con los atacantes, distribuye el balón, controla los tiempos del partido y presiona en la zona media.',
    };
  }

  if (pos.includes('wing') || pos.includes('winger') || pos.includes('extremo')) {
    return {
      positionEs: 'Extremo / Attacking Winger',
      category: 'Delantero',
      descriptionEs: 'Atacante de banda caracterizado por su velocidad, desborde individual en el 1 contra 1 y capacidad para generar centros al área rival o recortar hacia adentro para rematar.',
    };
  }

  if (pos.includes('forward') || pos.includes('striker') || pos.includes('delantero') || pos.includes('centre-forward')) {
    return {
      positionEs: 'Delantero Centro / Ariete',
      category: 'Delantero',
      descriptionEs: 'Principal referente de ataque en el área rival. Encargado de desmarcarse, fijar a los centrales contrarios y definir las jugadas de gol.',
    };
  }

  return {
    positionEs: strPosition && strPosition.trim() ? strPosition : 'Jugador de Campo',
    category: 'Centrocampista',
    descriptionEs: 'Jugador versátil en el esquema táctico del equipo, adaptable a múltiples funciones de transición y apoyo.',
  };
}

/**
 * Normalizes a raw TheSportsDB player object into a clean standard Player object.
 */
export function normalizePlayer(raw: TheSportsDBPlayer): Player {
  const name = raw.strPlayer?.trim() || 'No disponible';
  const team = raw.strTeam && raw.strTeam.trim() && !raw.strTeam.startsWith('_') ? raw.strTeam.trim() : 'No disponible';
  const nationality = raw.strNationality?.trim() || 'No disponible';
  const rawPos = raw.strPosition?.trim() || 'No disponible';
  const posInfo = getPositionEducationalInfo(rawPos);

  const age = calculateAge(raw.dateBorn);
  const heightCm = parseHeightCm(raw.strHeight);
  const weightKg = parseWeightKg(raw.strWeight);

  // Pick best high quality available image (Cutout PNG > Render PNG > Thumb JPG)
  let imageUrl: string | null = null;
  if (raw.strCutout && raw.strCutout.startsWith('http')) {
    imageUrl = raw.strCutout;
  } else if (raw.strRender && raw.strRender.startsWith('http')) {
    imageUrl = raw.strRender;
  } else if (raw.strThumb && raw.strThumb.startsWith('http')) {
    imageUrl = raw.strThumb;
  }

  const description = raw.strDescriptionES && raw.strDescriptionES.trim()
    ? raw.strDescriptionES.trim()
    : (raw.strDescriptionEN && raw.strDescriptionEN.trim()
      ? raw.strDescriptionEN.trim()
      : 'No hay descripción detallada disponible para este futbolista.');

  return {
    idPlayer: raw.idPlayer,
    strPlayer: name,
    strNationality: nationality,
    strTeam: team,
    dateBorn: raw.dateBorn || null,
    age,
    strPosition: rawPos,
    positionInfo: posInfo,
    heightCm,
    formattedHeight: heightCm ? `${heightCm} cm` : 'No disponible',
    weightKg,
    formattedWeight: weightKg ? `${weightKg} kg` : 'No disponible',
    imageUrl,
    thumbUrl: raw.strThumb || imageUrl,
    description,
    strNumber: raw.strNumber || null,
  };
}
