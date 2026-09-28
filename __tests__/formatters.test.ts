/**
 * Tests des formateurs de présentation.
 *
 * Le formatage n'est pas cosmétique : une concentration affichée « 1 024 »
 * quand la valeur est 1,024, ou un tiret affiché pour une valeur nulle, induit
 * en erreur l'exploitant qui prend une décision à partir de l'écran.
 */

import {
  formatAge,
  formatHumidity,
  formatPpm,
  formatRssi,
  formatTemperature,
  formatTime,
} from '~/utils/formatters';

describe('formatPpm', () => {
  it('adapte la précision à l’ordre de grandeur', () => {
    // Deux décimales pour le H2S (valeurs subunitaires), zéro pour le CO2 :
    // une précision fixe inverserait l'importance apparente.
    expect(formatPpm(2.456)).toBe('2.46');
    expect(formatPpm(15.5)).toBe('15.5');
    expect(formatPpm(820)).toBe('820');
    expect(espaces(formatPpm(1000))).toBe('1 000');
  });

  it('renvoie un tiret pour une mesure absente', () => {
    // Jamais « 0 » : un capteur qui ne mesure pas n'est pas un capteur à zéro.
    expect(formatPpm(null)).toBe('—');
    expect(formatPpm(undefined)).toBe('—');
    expect(formatPpm(NaN)).toBe('—');
  });

  it('reste lisible sur les valeurs extrêmes', () => {
    expect(formatPpm(0)).toBe('0.00');
    expect(espaces(formatPpm(100000))).toBe('100 000');
  });
});

describe('formatTemperature', () => {
  it('ajoute une décimale et l’unité', () => {
    expect(formatTemperature(27.44)).toBe('27.4 °C');
    expect(formatTemperature(-3)).toBe('-3.0 °C');
  });

  it('renvoie un tiret pour une mesure absente', () => {
    expect(formatTemperature(null)).toBe('—');
    expect(formatTemperature(undefined)).toBe('—');
  });
});

describe('formatHumidity', () => {
  it('arrondit au degré près', () => {
    expect(formatHumidity(41.26)).toBe('41 %');
    expect(formatHumidity(0)).toBe('0 %');
  });

  it('renvoie un tiret pour une mesure absente', () => {
    expect(formatHumidity(null)).toBe('—');
  });
});

describe('formatRssi', () => {
  it('apprécie la qualité du signal Wi-Fi', () => {
    expect(formatRssi(-40)).toEqual({ text: '-40 dBm', quality: 'good' });
    expect(formatRssi(-70)).toEqual({ text: '-70 dBm', quality: 'fair' });
    expect(formatRssi(-88)).toEqual({ text: '-88 dBm', quality: 'poor' });
  });

  it('renvoie un tiret et une qualité inconnue pour une mesure absente', () => {
    expect(formatRssi(null)).toEqual({ text: '—', quality: 'unknown' });
  });
});

describe('formatAge', () => {
  const base = 1_700_000_000_000;

  it('exprime l’ancienneté en langage courant', () => {
    expect(formatAge(base, base)).toBe("à l'instant");
    expect(formatAge(base - 2_000, base)).toBe("à l'instant");
    expect(formatAge(base - 30_000, base)).toBe('il y a 30 s');
    expect(formatAge(base - 5 * 60_000, base)).toBe('il y a 5 min');
    expect(formatAge(base - 3 * 3_600_000, base)).toBe('il y a 3 h');
    expect(formatAge(base - 2 * 86_400_000, base)).toBe('il y a 2 j');
  });

  it('ne produit jamais d’ancienneté négative', () => {
    // Horloge du capteur en avance : l'écran ne doit pas afficher « il y a -5 s ».
    expect(formatAge(base + 60_000, base)).toBe("à l'instant");
  });
});

describe('formatTime', () => {
  it('renvoie une heure lisible', () => {
    const texte = formatTime(new Date(2026, 0, 15, 14, 30, 5).getTime());
    expect(texte).toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });
});

/**
 * Remplace toutes les espaces de séparation de milliers par une espace normale.
 *
 * `toLocaleString('fr-FR')` utilise l'espace insécable fine (U+202F) sur les
 * runtimes récents, l'insécable (U+00A0) sur les plus anciens, et une espace
 * ordinaire ailleurs. Ce sont trois variantes typographiquement correctes du
 * même séparateur : le test vérifie le regroupement des chiffres, pas le
 * point de code choisi par la version d'ICU du poste.
 */
function espaces(texte: string): string {
  return texte.replace(/[   ]/g, ' ');
}
