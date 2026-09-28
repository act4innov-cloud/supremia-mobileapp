/**
 * Tests des calculs de supervision des gaz.
 *
 * Ces fonctions décident ce qui s'affiche à l'écran. Une régression ici peut
 * afficher « conforme » alors qu'une concentration est dangereuse : les tests
 * verrouillent donc les cas limites, pas seulement le cas nominal.
 */

import { GAS_DISPLAY_MAX, GAS_THRESHOLDS } from '~/config/gas.config';
import {
  compareStatus,
  countByStatus,
  fillRatio,
  marginToWarning,
  normalizeStatus,
  siteStatus,
  statusFor,
  warningRatio,
  worstStatus,
} from '~/utils/gasCalculations';
import type { GasStatus } from '~/types/sensor.types';

describe('statusFor', () => {
  it('applique le seuil juste en dessous et juste au-dessus', () => {
    const { warning, alarm } = GAS_THRESHOLDS.h2s;
    expect(statusFor('h2s', warning - 0.01)).toBe('normal');
    expect(statusFor('h2s', warning)).toBe('warning');
    expect(statusFor('h2s', alarm - 0.01)).toBe('warning');
    expect(statusFor('h2s', alarm)).toBe('alarm');
  });

  it('reste cohérent pour les trois gaz malgré des seuils différents', () => {
    for (const kind of ['h2s', 'co', 'co2'] as const) {
      const { warning, alarm } = GAS_THRESHOLDS[kind];
      expect(statusFor(kind, 0)).toBe('normal');
      expect(statusFor(kind, warning)).toBe('warning');
      expect(statusFor(kind, alarm)).toBe('alarm');
      expect(statusFor(kind, alarm * 10)).toBe('alarm');
    }
  });

  it('ne confond jamais une mesure absente et une mesure nulle', () => {
    // 0 ppm est une mesure valide et rassurante ; `null` signifie « le capteur
    // n'a rien envoyé ». Les confondre afficherait une sécurité inexistante.
    expect(statusFor('h2s', 0)).toBe('normal');
    expect(statusFor('h2s', null)).toBe('unknown');
    expect(statusFor('h2s', NaN)).toBe('unknown');
    expect(statusFor('h2s', Infinity)).toBe('unknown');
  });
});

describe('worstStatus', () => {
  it('retient le statut le plus grave', () => {
    expect(worstStatus(['normal', 'alarm', 'warning'])).toBe('alarm');
    expect(worstStatus(['normal', 'warning'])).toBe('warning');
    expect(worstStatus(['normal', 'normal'])).toBe('normal');
  });

  it('préfère un statut connu à un statut inconnu', () => {
    expect(worstStatus(['unknown', 'normal'])).toBe('normal');
  });

  it('renvoie inconnu si rien n’est connu', () => {
    expect(worstStatus(['unknown', 'unknown'])).toBe('unknown');
    expect(worstStatus([])).toBe('unknown');
  });
});

describe('siteStatus', () => {
  it('agrège le pire statut des capteurs en ligne', () => {
    expect(
      siteStatus([
        { status: 'normal', isOnline: true },
        { status: 'alarm', isOnline: true },
      ]),
    ).toBe('alarm');
    expect(
      siteStatus([
        { status: 'normal', isOnline: true },
        { status: 'warning', isOnline: true },
      ]),
    ).toBe('warning');
  });

  it('dégrade le site en alerte dès qu’un capteur est hors ligne', () => {
    // Perdre la vue d'un capteur n'est pas conforme, même si tout le reste est
    // normal : sans mesure, aucune conformité ne peut être affirmée.
    expect(
      siteStatus([
        { status: 'normal', isOnline: true },
        { status: 'normal', isOnline: false },
      ]),
    ).toBe('warning');
  });

  it('ignore le statut d’un capteur hors ligne pour le pire statut', () => {
    // Un capteur hors ligne garde son dernier statut connu, souvent « alarm ».
    // S'il comptait, le site resterait rouge indéfiniment après une panne.
    expect(
      siteStatus([
        { status: 'normal', isOnline: true },
        { status: 'alarm', isOnline: false },
      ]),
    ).toBe('warning');
  });

  it('renvoie inconnu pour un site sans aucun capteur', () => {
    expect(siteStatus([])).toBe('unknown');
  });
});

describe('fillRatio', () => {
  it('renvoie 0 pour une mesure nulle, négative ou absente', () => {
    expect(fillRatio('h2s', 0)).toBe(0);
    expect(fillRatio('h2s', -5)).toBe(0);
    expect(fillRatio('h2s', null)).toBe(0);
  });

  it('progresse proportionnellement puis sature', () => {
    expect(fillRatio('h2s', GAS_DISPLAY_MAX.h2s / 2)).toBeCloseTo(0.5);
    expect(fillRatio('h2s', GAS_DISPLAY_MAX.h2s)).toBe(1);
    expect(fillRatio('h2s', GAS_DISPLAY_MAX.h2s * 10)).toBe(1);
  });

  it('reste dans l’intervalle [0, 1] pour toutes les valeurs', () => {
    for (const kind of ['h2s', 'co', 'co2'] as const) {
      for (const valeur of [0, 1, 999, 100000]) {
        const ratio = fillRatio(kind, valeur);
        expect(ratio).toBeGreaterThanOrEqual(0);
        expect(ratio).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('warningRatio', () => {
  it('positionne le seuil d’alerte dans l’échelle de la jauge', () => {
    expect(warningRatio('h2s')).toBeCloseTo(GAS_THRESHOLDS.h2s.warning / GAS_DISPLAY_MAX.h2s);
    expect(warningRatio('co2')).toBeCloseTo(
      GAS_THRESHOLDS.co2.warning / GAS_DISPLAY_MAX.co2,
    );
  });

  it('ne dépasse jamais 1, même si un seuil est mal configuré', () => {
    for (const kind of ['h2s', 'co', 'co2'] as const) {
      expect(warningRatio(kind)).toBeLessThanOrEqual(1);
    }
  });
});

describe('marginToWarning', () => {
  it('donne la marge restante avant le seuil d’alerte', () => {
    expect(marginToWarning('h2s', 4)).toBe(GAS_THRESHOLDS.h2s.warning - 4);
  });

  it('devient négative quand le seuil est dépassé', () => {
    expect(marginToWarning('h2s', 25)).toBeLessThan(0);
  });

  it('renvoie null pour une mesure absente plutôt que zéro', () => {
    // Une marge de 0 laisserait croire que le capteur est exactement au seuil.
    expect(marginToWarning('h2s', null)).toBeNull();
    expect(marginToWarning('h2s', NaN)).toBeNull();
  });
});

describe('countByStatus', () => {
  it('compte chaque statut', () => {
    expect(
      countByStatus(['normal', 'normal', 'warning', 'alarm', 'unknown']),
    ).toEqual({ normal: 2, warning: 1, alarm: 1, unknown: 1 });
  });

  it('renvoie des compteurs à zéro sur une liste vide', () => {
    expect(countByStatus([])).toEqual({ normal: 0, warning: 0, alarm: 0, unknown: 0 });
  });
});

describe('normalizeStatus', () => {
  it('reconnaît les variantes textuelles, quelle que soit la casse', () => {
    expect(normalizeStatus('OK')).toBe('normal');
    expect(normalizeStatus(' Normal ')).toBe('normal');
    expect(normalizeStatus('WARNING')).toBe('warning');
    expect(normalizeStatus('alerte')).toBe('warning');
    expect(normalizeStatus('critique')).toBe('alarm');
  });

  it('interprète un statut numérique', () => {
    expect(normalizeStatus(0)).toBe('normal');
    expect(normalizeStatus(1)).toBe('warning');
    expect(normalizeStatus(2)).toBe('alarm');
  });

  it('renvoie inconnu plutôt que de deviner', () => {
    expect(normalizeStatus('peut-etre')).toBe('unknown');
    expect(normalizeStatus('')).toBe('unknown');
    expect(normalizeStatus(null)).toBe('unknown');
    expect(normalizeStatus(undefined)).toBe('unknown');
  });
});

describe('compareStatus', () => {
  it('ordonne du plus grave au plus rassurant', () => {
    const statuts: GasStatus[] = ['unknown', 'normal', 'alarm', 'warning'];
    expect(statuts.sort(compareStatus)).toEqual(['alarm', 'warning', 'normal', 'unknown']);
  });
});
