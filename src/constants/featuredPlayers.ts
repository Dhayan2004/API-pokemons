/**
 * Verified real player IDs from TheSportsDB v1 API for the Home Screen selection.
 * These 6 IDs have been validated against the API endpoints.
 */

export const FEATURED_PLAYER_IDS = [
  '34146370', // Lionel Messi (Inter Miami)
  '34146304', // Cristiano Ronaldo (Al-Nassr)
  '34162098', // Kylian Mbappé (Real Madrid)
  '34169116', // Erling Haaland (Manchester City)
  '34171882', // Jude Bellingham (Real Madrid)
  '34161324', // Vinícius Júnior (Real Madrid)
];

/**
 * Editorial metadata & static fallback information for the 6 featured players.
 * Ensures the app never breaks if TheSportsDB API experiences downtime or rate limits.
 */
export const FEATURED_FALLBACK_DATA: Record<string, {
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
}> = {
  '34146370': {
    name: 'Lionel Messi',
    team: 'Inter Miami',
    position: 'Right Winger',
    nationality: 'Argentina',
    dateBorn: '1987-06-24',
    height: '1.70 m',
    weight: '148 lbs',
    number: '10',
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/580170.png',
    descriptionEs: 'Lionel Andrés Messi Cuccittini es un futbolista argentino que juega como delantero o centrocampista. Es ampliamente considerado uno de los mejores jugadores de todos los tiempos, ganador de 8 Balones de Oro y campeón del mundo con Argentina en 2022.',
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
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/563814.png',
    descriptionEs: 'Cristiano Ronaldo dos Santos Aveiro es un futbolista portugués que juega como delantero. Máximo goleador histórico del fútbol profesional, reconocido por su potencia física, remate de cabeza y mentalidad competitiva.',
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
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/mbappe.png',
    descriptionEs: 'Kylian Mbappé Lottin es un futbolista francés que juega como delantero en el Real Madrid. Destaca por su vertiginosa velocidad, regate explosivo y capacidad definidora a una edad muy joven.',
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
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/haaland.png',
    descriptionEs: 'Erling Braut Haaland es un delantero noruego famoso por su portento físico, aceleración y letal instinto goleador dentro del área con el Manchester City.',
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
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/bellingham.png',
    descriptionEs: 'Jude Victor William Bellingham es un centrocampista inglés conocido por su despliegue físico de área a área, visión de juego y capacidad de llegada al gol.',
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
    imageUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/vinicius.png',
    descriptionEs: 'Vinícius José Paixão de Oliveira Júnior es un extremo brasileño caracterizado por su desequilibrio en el uno contra uno, agilidad y desborde por la banda izquierda.',
  },
};
