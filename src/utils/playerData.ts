import { PositionEducationalInfo, Player, TheSportsDBPlayer } from '../types/player';

/**
 * Calculates full completed age from birth date string (YYYY-MM-DD).
 * Considers whether the birthday has already occurred this calendar year.
 */
export function calculateAge(dateBornStr?: string | null): number | null {
  if (!dateBornStr || typeof dateBornStr !== 'string') return null;

  const parts = dateBornStr.trim().split('-');
  if (parts.length < 3) return null;

  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10); // 1-indexed (1 to 12)
  const birthDay = parseInt(parts[2], 10);   // 1 to 31

  if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) return null;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-indexed (1 to 12)
  const currentDay = today.getDate();

  let age = currentYear - birthYear;

  // If the birthday hasn't occurred yet this year, subtract 1
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age >= 0 && age < 120 ? age : null;
}

/**
 * Normalizes raw height string from API to centimeters.
 * Strictly checks for explicit unit indicators (m, cm, ft/in) to avoid false conversions.
 * Examples handled:
 * - "1.85 m", "1.70 m (5 ft 7 in)", "1.78m" -> 185, 170, 178
 * - "188 cm", "176cm" -> 188, 176
 * - "6 ft 2 in", "6'2"" -> 188
 * Missing, zero or ambiguous inputs return null.
 */
export function parseHeightCm(strHeight?: string | null): number | null {
  if (!strHeight || typeof strHeight !== 'string') return null;
  const str = strHeight.trim().toLowerCase();
  if (str === '' || str === '0' || str.includes('null') || str.includes('n/a')) return null;

  // Case 1: Explicit meter format with decimal e.g. "1.70 m", "1.78m"
  const metersMatch = str.match(/(\d+\.\d+)\s*m\b/);
  if (metersMatch) {
    const meters = parseFloat(metersMatch[1]);
    if (!isNaN(meters) && meters >= 1.2 && meters <= 2.4) {
      return Math.round(meters * 100);
    }
  }

  // Case 2: Explicit centimeters e.g. "188 cm", "176cm"
  const cmMatch = str.match(/(\d{2,3})\s*cm\b/);
  if (cmMatch) {
    const cm = parseInt(cmMatch[1], 10);
    if (!isNaN(cm) && cm >= 120 && cm <= 240) {
      return cm;
    }
  }

  // Case 3: Explicit Imperial feet & inches e.g. "5 ft 10 in" or "6'2"
  const ftInMatch = str.match(/(\d+)\s*(?:ft|')\s*(\d+)?\s*(?:in|")?/);
  if (ftInMatch) {
    const feet = parseInt(ftInMatch[1], 10);
    const inches = ftInMatch[2] ? parseInt(ftInMatch[2], 10) : 0;
    if (!isNaN(feet) && feet >= 4 && feet <= 7) {
      const totalInches = feet * 12 + inches;
      return Math.round(totalInches * 2.54);
    }
  }

  // If no explicit unit or ambiguous, return null (never assume 0 or arbitrary unit)
  return null;
}

/**
 * Normalizes raw weight string from API to kilograms.
 * Strictly checks for explicit unit indicators (kg, lbs/lb).
 * Examples handled:
 * - "85 kg", "(74 kg)", "74kg" -> 85, 74
 * - "148 lbs", "183 lb" -> Math.round(183 * 0.453592) = 83
 * Missing, zero or ambiguous inputs return null.
 */
export function parseWeightKg(strWeight?: string | null): number | null {
  if (!strWeight || typeof strWeight !== 'string') return null;
  const str = strWeight.trim().toLowerCase();
  if (str === '' || str === '0' || str.includes('null') || str.includes('n/a')) return null;

  // Case 1: Explicit kg in string or parentheses e.g. "(74 kg)" or "85 kg"
  const kgMatch = str.match(/(\d{2,3})\s*kg\b/);
  if (kgMatch) {
    const kg = parseInt(kgMatch[1], 10);
    if (!isNaN(kg) && kg >= 40 && kg <= 150) {
      return kg;
    }
  }

  // Case 2: Explicit pounds e.g. "148 lbs", "183 lb"
  const lbsMatch = str.match(/(\d{2,3})\s*lbs?\b/);
  if (lbsMatch) {
    const lbs = parseInt(lbsMatch[1], 10);
    if (!isNaN(lbs) && lbs >= 80 && lbs <= 330) {
      return Math.round(lbs * 0.453592);
    }
  }

  // If no explicit unit or ambiguous, return null (never convert missing to 0)
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
 * Returns short Spanish position names:
 * "Portero", "Defensa", "Mediocampista", "Extremo", "Delantero".
 * Avoids verbose or dual tags like "Extremo / Attacking Winger".
 */
export function getShortPositionEs(strPosition?: string | null): string {
  if (!strPosition || typeof strPosition !== 'string' || !strPosition.trim()) {
    return 'No disponible';
  }

  const pos = strPosition.trim().toLowerCase();

  if (pos.includes('goalkeeper') || pos.includes('keeper') || pos.includes('portero')) {
    return 'Portero';
  }

  if (pos.includes('back') || pos.includes('defender') || pos.includes('defensa')) {
    return 'Defensa';
  }

  if (pos.includes('midfield') || pos.includes('medio') || pos.includes('volante')) {
    return 'Mediocampista';
  }

  if (pos.includes('wing') || pos.includes('winger') || pos.includes('extremo')) {
    return 'Extremo';
  }

  if (pos.includes('forward') || pos.includes('striker') || pos.includes('delantero') || pos.includes('ariete')) {
    return 'Delantero';
  }

  // Return clean raw value if already clean word, otherwise generic
  return strPosition.length < 20 ? strPosition.charAt(0).toUpperCase() + strPosition.slice(1) : 'Jugador de Campo';
}

/**
 * Educational breakdown of player positions in Spanish with short labels.
 */
export function getPositionEducationalInfo(strPosition?: string | null): PositionEducationalInfo {
  const pos = (strPosition || '').toLowerCase();

  if (pos.includes('goalkeeper') || pos.includes('keeper') || pos.includes('portero')) {
    return {
      positionEs: 'Portero',
      category: 'Portero',
      descriptionEs: 'Único jugador del equipo autorizado a usar las manos dentro de su área. Su objetivo principal es evitar que el balón entre en la portería y dirigir la línea defensiva.',
    };
  }

  if (pos.includes('back') || pos.includes('defender') || pos.includes('defensa')) {
    return {
      positionEs: 'Defensa',
      category: 'Defensa',
      descriptionEs: 'Responsable de neutralizar las jugadas de ataque del rival, recuperar la posesión, cortar pases filtrados y reiniciar la construcción del juego desde la zona posterior.',
    };
  }

  if (pos.includes('midfield') || pos.includes('medio') || pos.includes('volante')) {
    return {
      positionEs: 'Mediocampista',
      category: 'Centrocampista',
      descriptionEs: 'Eje táctico de transición. Conecta la línea defensiva con los atacantes, distribuye el balón, controla los tiempos del partido y presiona en la zona media.',
    };
  }

  if (pos.includes('wing') || pos.includes('winger') || pos.includes('extremo')) {
    return {
      positionEs: 'Extremo',
      category: 'Delantero',
      descriptionEs: 'Atacante de banda caracterizado por su velocidad, desborde individual en el 1 contra 1 y capacidad para generar centros al área rival o recortar hacia adentro para rematar.',
    };
  }

  if (pos.includes('forward') || pos.includes('striker') || pos.includes('delantero') || pos.includes('ariete')) {
    return {
      positionEs: 'Delantero',
      category: 'Delantero',
      descriptionEs: 'Principal referente de ataque en el área rival. Encargado de desmarcarse, fijar a los centrales contrarios y definir las jugadas de gol.',
    };
  }

  const shortPos = getShortPositionEs(strPosition);
  return {
    positionEs: shortPos,
    category: 'Centrocampista',
    descriptionEs: 'Jugador versátil en el esquema táctico del equipo, adaptable a múltiples funciones de transición y apoyo.',
  };
}

/**
 * Normalizes a raw TheSportsDB player object into a clean standard Player object.
 */
export function normalizePlayer(raw: TheSportsDBPlayer, isComplete = false): Player {
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
    isComplete: isComplete || (heightCm !== null && weightKg !== null),
  };
}

// ============================================================================
// Funciones descriptivas de comparación neutral
// ============================================================================

/**
 * Calculates neutral age difference description.
 * Example: "[Nombre] tiene 3 años menos" or "Ambos tienen la misma edad".
 */
export function getAgeDifference(p1: Player, p2: Player): string | null {
  if (p1.age === null || p2.age === null) return null;

  if (p1.age === p2.age) {
    return `Ambos tienen la misma edad (${p1.age} años).`;
  }

  const diff = Math.abs(p1.age - p2.age);
  const unit = diff === 1 ? 'año' : 'años';

  if (p1.age < p2.age) {
    return `${p1.strPlayer} tiene ${diff} ${unit} menos que ${p2.strPlayer}.`;
  } else {
    return `${p2.strPlayer} tiene ${diff} ${unit} menos que ${p1.strPlayer}.`;
  }
}

/**
 * Calculates neutral height difference description.
 * Example: "[Nombre] mide 8 cm más" or "Ambos tienen la misma estatura".
 */
export function getHeightDifference(p1: Player, p2: Player): string | null {
  if (p1.heightCm === null || p2.heightCm === null) return null;

  if (p1.heightCm === p2.heightCm) {
    return `Ambos tienen la misma estatura (${p1.heightCm} cm).`;
  }

  const diff = Math.abs(p1.heightCm - p2.heightCm);

  if (p1.heightCm > p2.heightCm) {
    return `${p1.strPlayer} mide ${diff} cm más que ${p2.strPlayer}.`;
  } else {
    return `${p2.strPlayer} mide ${diff} cm más que ${p1.strPlayer}.`;
  }
}

/**
 * Calculates neutral weight difference description.
 * Example: "La diferencia de peso es de 5 kg" or "Ambos registran el mismo peso".
 */
export function getWeightDifference(p1: Player, p2: Player): string | null {
  if (p1.weightKg === null || p2.weightKg === null) return null;

  if (p1.weightKg === p2.weightKg) {
    return `Ambos registran el mismo peso (${p1.weightKg} kg).`;
  }

  const diff = Math.abs(p1.weightKg - p2.weightKg);
  const heavierPlayer = p1.weightKg > p2.weightKg ? p1.strPlayer : p2.strPlayer;
  return `La diferencia de peso es de ${diff} kg (${heavierPlayer} registra mayor peso).`;
}
