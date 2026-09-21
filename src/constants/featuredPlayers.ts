/**
 * Catalog of 24 verified professional football players.
 * Validated against TheSportsDB v1 API.
 *
 * Ordered with the original 6 featured players first so that the initial view
 * without filters displays them first as requested.
 */

export type PositionCategory = 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';

export interface CatalogItem {
  id: string;
  name: string;
  category: PositionCategory;
}

export const CATALOG_PLAYERS: CatalogItem[] = [
  // 1-6: Initial 6 featured players
  { id: '34146370', name: 'Lionel Messi', category: 'Delantero' },
  { id: '34146304', name: 'Cristiano Ronaldo', category: 'Delantero' },
  { id: '34162098', name: 'Kylian Mbappé', category: 'Delantero' },
  { id: '34169116', name: 'Erling Haaland', category: 'Delantero' },
  { id: '34171882', name: 'Jude Bellingham', category: 'Centrocampista' },
  { id: '34161324', name: 'Vinícius Júnior', category: 'Delantero' },

  // 7-12: Porteros (6)
  { id: '34145514', name: 'Thibaut Courtois', category: 'Portero' },
  { id: '34163551', name: 'Alisson Becker', category: 'Portero' },
  { id: '34146911', name: 'Ederson Moraes', category: 'Portero' },
  { id: '34159222', name: 'Jan Oblak', category: 'Portero' },
  { id: '34145423', name: 'Emiliano Martínez', category: 'Portero' },
  { id: '34162303', name: 'Gianluigi Donnarumma', category: 'Portero' },

  // 13-18: Defensas (6)
  { id: '34147021', name: 'Virgil van Dijk', category: 'Defensa' },
  { id: '34162490', name: 'Rúben Dias', category: 'Defensa' },
  { id: '34161947', name: 'Achraf Hakimi', category: 'Defensa' },
  { id: '34161593', name: 'Trent Alexander-Arnold', category: 'Defensa' },
  { id: '34172293', name: 'William Saliba', category: 'Defensa' },
  { id: '34152561', name: 'Marquinhos', category: 'Defensa' },

  // 19-23: Rest of Mediocampistas (Bellingham is in 1-6)
  { id: '34163415', name: 'Rodri', category: 'Centrocampista' },
  { id: '34155057', name: 'Kevin De Bruyne', category: 'Centrocampista' },
  { id: '34164200', name: 'Federico Valverde', category: 'Centrocampista' },
  { id: '34172243', name: 'Pedri', category: 'Centrocampista' },
  { id: '34163007', name: 'Bruno Fernandes', category: 'Centrocampista' },

  // 24: Rest of Delanteros (Messi, Ronaldo, Mbappé, Haaland, Vinícius are in 1-6)
  { id: '34145506', name: 'Mohamed Salah', category: 'Delantero' },
];

export const FEATURED_PLAYER_IDS = CATALOG_PLAYERS.slice(0, 6).map((p) => p.id);

export interface FallbackPlayerData {
  name: string;
  team: string;
  position: string;
  nationality: string;
  dateBorn: string;
  height: string;
  weight: string;
  number: string;
  imageUrl: string;
  descriptionEs: string;
}

/**
 * Verified fallback data for all 24 catalog players.
 * Guarantees that if TheSportsDB experiences rate limiting (Cloudflare 1015 / 429),
 * the app continues to operate with complete accuracy and zero crashes.
 */
export const CATALOG_FALLBACK_DATA: Record<string, FallbackPlayerData> = {
  // Delanteros iniciales
  '34146370': {
    name: 'Lionel Messi',
    team: 'Inter Miami',
    position: 'Right Winger',
    nationality: 'Argentina',
    dateBorn: '1987-06-24',
    height: '1.70 m',
    weight: '148 lbs',
    number: '10',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/e0i2051750317027.png',
    descriptionEs: 'Lionel Andrés Messi Cuccittini es un futbolista argentino que juega como delantero o centrocampista. Ganador de 8 Balones de Oro y campeón del mundo con Argentina en 2022.',
  },
  '34146304': {
    name: 'Cristiano Ronaldo',
    team: 'Al-Nassr',
    position: 'Centre-Forward',
    nationality: 'Portugal',
    dateBorn: '1985-02-05',
    height: '188 cm',
    weight: '183 lbs',
    number: '7',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/a19jje1761592498.png',
    descriptionEs: 'Cristiano Ronaldo dos Santos Aveiro es un futbolista portugués que juega como delantero. Máximo goleador histórico del fútbol profesional.',
  },
  '34162098': {
    name: 'Kylian Mbappé',
    team: 'Real Madrid',
    position: 'Centre-Forward',
    nationality: 'France',
    dateBorn: '1998-12-20',
    height: '1.78 m',
    weight: '74 kg',
    number: '9',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/cxrmkm1788114306.png',
    descriptionEs: 'Kylian Mbappé Lottin es un futbolista francés que juega como delantero en el Real Madrid. Destaca por su velocidad, regate y definición.',
  },
  '34169116': {
    name: 'Erling Haaland',
    team: 'Manchester City',
    position: 'Centre-Forward',
    nationality: 'Norway',
    dateBorn: '2000-07-21',
    height: '195 cm',
    weight: '192 lbs',
    number: '9',
    imageUrl: 'https://www.thesportsdb.com/images/media/player/cutout/e8cart1789115621.png',
    descriptionEs: 'Erling Braut Haaland es un delantero noruego famoso por su poderío físico, aceleración e instinto goleador con el Manchester City.',
  },
  '34171882': {
    name: 'Jude Bellingham',
    team: 'Real Madrid',
    position: 'Attacking Midfield',
    nationality: 'England',
    dateBorn: '2003-06-29',
    height: '1.86 m',
    weight: '163 lbs',
    number: '5',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/7idg7x1788113677.png',
    descriptionEs: 'Jude Victor William Bellingham es un centrocampista inglés conocido por su despliegue físico de área a área y llegada al gol.',
  },
  '34161324': {
    name: 'Vinícius Júnior',
    team: 'Real Madrid',
    position: 'Left Wing',
    nationality: 'Brazil',
    dateBorn: '2000-07-12',
    height: '176 cm',
    weight: '161 lbs',
    number: '7',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/z5o9zt1788114155.png',
    descriptionEs: 'Vinícius José Paixão de Oliveira Júnior es un extremo brasileño caracterizado por su regate, desborde y velocidad en el uno contra uno.',
  },

  // Mohamed Salah
  '34145506': {
    name: 'Mohamed Salah',
    team: 'Liverpool',
    position: 'Right Winger',
    nationality: 'Egypt',
    dateBorn: '1992-06-15',
    height: '1.75 m',
    weight: '71 kg',
    number: '11',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/1u9o321727781031.png',
    descriptionEs: 'Mohamed Salah Hamed Mahrous Ghaly es un delantero egipcio del Liverpool, célebre por su definición, velocidad y liderazgo.',
  },

  // Porteros
  '34145514': {
    name: 'Thibaut Courtois',
    team: 'Real Madrid',
    position: 'Goalkeeper',
    nationality: 'Belgium',
    dateBorn: '1992-05-11',
    height: '2.00 m',
    weight: '96 kg',
    number: '1',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/y64o0v1788114197.png',
    descriptionEs: 'Thibaut Nicolas Marc Courtois es un guardameta belga del Real Madrid, reconocido por su imponente estatura, reflejos y seguridad bajo los tres palos.',
  },
  '34163551': {
    name: 'Alisson Becker',
    team: 'Liverpool',
    position: 'Goalkeeper',
    nationality: 'Brazil',
    dateBorn: '1992-10-02',
    height: '1.93 m',
    weight: '91 kg',
    number: '1',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/y9477s1727780962.png',
    descriptionEs: 'Alisson Ramsés Becker es un portero brasileño del Liverpool, destacado por su colocación, juego con los pies y dominio en el mano a mano.',
  },
  '34146911': {
    name: 'Ederson Moraes',
    team: 'Manchester City',
    position: 'Goalkeeper',
    nationality: 'Brazil',
    dateBorn: '1993-08-17',
    height: '1.88 m',
    weight: '86 kg',
    number: '31',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/qoxg0u1789115712.png',
    descriptionEs: 'Ederson Santana de Moraes es un portero brasileño del Manchester City, famoso por su extraordinaria precisión en el pase largo y temple.',
  },
  '34159222': {
    name: 'Jan Oblak',
    team: 'Atlético Madrid',
    position: 'Goalkeeper',
    nationality: 'Slovenia',
    dateBorn: '1993-01-07',
    height: '1.88 m',
    weight: '87 kg',
    number: '13',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/2q552b1788115206.png',
    descriptionEs: 'Jan Oblak es un guardameta esloveno del Atlético de Madrid, considerado uno de los cancerberos más regulares y sobrios de Europa.',
  },
  '34145423': {
    name: 'Emiliano Martínez',
    team: 'Aston Villa',
    position: 'Goalkeeper',
    nationality: 'Argentina',
    dateBorn: '1992-09-02',
    height: '1.95 m',
    weight: '88 kg',
    number: '23',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/e542p71727782194.png',
    descriptionEs: 'Damián Emiliano Martínez Romero, conocido como Dibu, es el portero titular de la Selección Argentina campeona del mundo y del Aston Villa.',
  },
  '34162303': {
    name: 'Gianluigi Donnarumma',
    team: 'Paris Saint-Germain',
    position: 'Goalkeeper',
    nationality: 'Italy',
    dateBorn: '1999-02-25',
    height: '1.96 m',
    weight: '90 kg',
    number: '1',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/q9d0u01727783995.png',
    descriptionEs: 'Gianluigi Donnarumma es un guardameta italiano del PSG y de la selección italiana, con gran alcance en estiradas y dominio del juego aéreo.',
  },

  // Defensas
  '34147021': {
    name: 'Virgil van Dijk',
    team: 'Liverpool',
    position: 'Centre-Back',
    nationality: 'Netherlands',
    dateBorn: '1991-07-08',
    height: '1.93 m',
    weight: '92 kg',
    number: '4',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/42b9181727780998.png',
    descriptionEs: 'Virgil van Dijk es un defensa central neerlandés y capitán del Liverpool, admirado por su jerarquía, fuerza y lectura táctica.',
  },
  '34162490': {
    name: 'Rúben Dias',
    team: 'Manchester City',
    position: 'Centre-Back',
    nationality: 'Portugal',
    dateBorn: '1997-05-14',
    height: '1.87 m',
    weight: '82 kg',
    number: '3',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/8zbb5u1789115743.png',
    descriptionEs: 'Rúben dos Santos Gato Alves Dias es un central portugués del Manchester City, referente defensivo por su contundencia y liderazgo.',
  },
  '34161947': {
    name: 'Achraf Hakimi',
    team: 'Paris Saint-Germain',
    position: 'Right-Back',
    nationality: 'Morocco',
    dateBorn: '1998-11-04',
    height: '1.81 m',
    weight: '73 kg',
    number: '2',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/v59f6m1727784012.png',
    descriptionEs: 'Achraf Hakimi Mouh es un lateral derecho marroquí del PSG, reconocido mundialmente por su velocidad explosiva y vocación ofensiva.',
  },
  '34161593': {
    name: 'Trent Alexander-Arnold',
    team: 'Liverpool',
    position: 'Right-Back',
    nationality: 'England',
    dateBorn: '1998-10-07',
    height: '1.75 m',
    weight: '69 kg',
    number: '66',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/v0e99q1727781014.png',
    descriptionEs: 'Trent John Alexander-Arnold es un lateral y creador de juego inglés del Liverpool, famoso por su precisión milimétrica en centros y tiros libres.',
  },
  '34172293': {
    name: 'William Saliba',
    team: 'Arsenal',
    position: 'Centre-Back',
    nationality: 'France',
    dateBorn: '2001-03-24',
    height: '1.92 m',
    weight: '85 kg',
    number: '2',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/15r1d71727780072.png',
    descriptionEs: 'William Alain André Gabriel Saliba es un zaguero francés del Arsenal, conocido por su serenidad, recuperación limpia y anticipación.',
  },
  '34152561': {
    name: 'Marquinhos',
    team: 'Paris Saint-Germain',
    position: 'Centre-Back',
    nationality: 'Brazil',
    dateBorn: '1994-05-14',
    height: '1.83 m',
    weight: '75 kg',
    number: '5',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/l776261727784032.png',
    descriptionEs: 'Marcos Aoás Corrêa, conocido como Marquinhos, es el capitán brasileño del PSG, con gran capacidad de corte e inicio de jugada.',
  },

  // Mediocampistas
  '34163415': {
    name: 'Rodri',
    team: 'Manchester City',
    position: 'Defensive Midfield',
    nationality: 'Spain',
    dateBorn: '1996-06-22',
    height: '1.90 m',
    weight: '82 kg',
    number: '16',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/6ggnc31769182523.png',
    descriptionEs: 'Rodrigo Hernández Cascante es un mediocentro español del Manchester City y Balón de Oro 2024, cerebro táctico del centro del campo.',
  },
  '34155057': {
    name: 'Kevin De Bruyne',
    team: 'Manchester City',
    position: 'Attacking Midfield',
    nationality: 'Belgium',
    dateBorn: '1991-06-28',
    height: '1.81 m',
    weight: '75 kg',
    number: '17',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/1g5x911789115682.png',
    descriptionEs: 'Kevin De Bruyne es un mediapunta belga del Manchester City, reconocido por su visión periférica de juego y asistencias quirúrgicas.',
  },
  '34164200': {
    name: 'Federico Valverde',
    team: 'Real Madrid',
    position: 'Central Midfield',
    nationality: 'Uruguay',
    dateBorn: '1998-07-22',
    height: '1.82 m',
    weight: '78 kg',
    number: '8',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/v5u79k1788114092.png',
    descriptionEs: 'Federico Santiago Valverde Dipetta es un centrocampista uruguayo del Real Madrid, caracterizado por su potencia física, disparo lejano y garra.',
  },
  '34172243': {
    name: 'Pedri',
    team: 'Barcelona',
    position: 'Central Midfield',
    nationality: 'Spain',
    dateBorn: '2002-11-25',
    height: '1.74 m',
    weight: '60 kg',
    number: '8',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/l7g04e1769182555.png',
    descriptionEs: 'Pedro González López, conocido como Pedri, es un centrocampista español del FC Barcelona con una técnica exquisita, visión y control de balón.',
  },
  '34163007': {
    name: 'Bruno Fernandes',
    team: 'Manchester United',
    position: 'Central Midfield',
    nationality: 'Portugal',
    dateBorn: '1994-09-08',
    height: '1.79 m',
    weight: '69 kg',
    number: '8',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/6h0e1l1727781395.png',
    descriptionEs: 'Bruno Miguel Borges Fernandes es el capitán portugués del Manchester United, generador de ocasiones y especialista a balón parado.',
  },
};

export const FEATURED_FALLBACK_DATA = CATALOG_FALLBACK_DATA;
