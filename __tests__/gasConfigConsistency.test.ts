/**
 * Cohérence entre les seuils affichés par l'app et ceux du cœur de domaine.
 *
 * L'app Android et la plateforme web doivent montrer la même gravité pour une
 * même mesure. Ces tests ne valident pas la justesse des seuils — ils ne le
 * peuvent pas, c'est une question HSE — mais ils verrouillent deux propriétés
 * mécaniques qui, si elles cassaient, produiraient un écran trompeur :
 *
 *   1. l'ordre `warning < alarm` pour chaque gaz ;
 *   2. le fait que l'app n'est jamais plus rassurante que le domaine.
 *
 * Le point 2 est le plus important : un écran qui affiche « conforme » là où
 * la plateforme web affiche « alerte » est un écart de sécurité, pas un
 * détail d'interface.
 */

import { GAS_THRESHOLDS as DOMAIN_THRESHOLDS } from '@supremia/domain';

import { GAS_THRESHOLDS } from '~/config/gas.config';
import { statusFor } from '~/utils/gasCalculations';
import type { GasKind, GasStatus } from '~/types/sensor.types';

const KINDS: GasKind[] = ['h2s', 'co', 'co2'];

/** Correspondance entre le libellé de l'app et celui du domaine. */
const CANONICAL: Record<GasKind, 'H2S' | 'CO' | 'CO2'> = {
  h2s: 'H2S',
  co: 'CO',
  co2: 'CO2',
};

describe('cohérence des seuils app / domaine', () => {
  it('respecte l’ordre croissant alerte puis alarme', () => {
    KINDS.forEach((kind) => {
      const { warning, alarm } = GAS_THRESHOLDS[kind];
      expect(warning).toBeLessThan(alarm);
    });
  });

  it('n’est jamais plus permissif que la valeur limite d’exposition', () => {
    // L'app doit au moins alerte à la VLE du domaine. Si un jour `warning`
    // descendait sous la TWA, l'app serait moins stricte que la plateforme.
    KINDS.forEach((kind) => {
      expect(GAS_THRESHOLDS[kind].warning).toBeLessThanOrEqual(
        DOMAIN_THRESHOLDS[CANONICAL[kind]].twa
      );
    });
  });

  it('n’est jamais plus permissif que la limite de courte durée', () => {
    KINDS.forEach((kind) => {
      expect(GAS_THRESHOLDS[kind].alarm).toBeLessThanOrEqual(
        DOMAIN_THRESHOLDS[CANONICAL[kind]].stel
      );
    });
  });
});

describe('divergence connue sur le CO2', () => {
  // Ce test ne cherche pas à valider le choix, mais à le rendre visible : si
  // quelqu’un aligne le CO2 sur la TWA sans mettre à jour la documentation,
  // ce test échoue et oblige à trancher explicitement.
  it('alerte avant la VLE, contrairement au domaine', () => {
    expect(GAS_THRESHOLDS.co2.warning).toBeLessThan(
      DOMAIN_THRESHOLDS.CO2.twa
    );
    expect(GAS_THRESHOLDS.co2.warning).toBe(1000);
  });

  it('conserve l’alarme à la valeur limite d’exposition', () => {
    expect(GAS_THRESHOLDS.co2.alarm).toBe(DOMAIN_THRESHOLDS.CO2.twa);
  });
});

describe('hiérarchie normal < warning < alarm', () => {
  it('classe une valeur intermédiaire en alerte', () => {
    KINDS.forEach((kind) => {
      const { warning, alarm } = GAS_THRESHOLDS[kind];
      const mid = (warning + alarm) / 2;
      expect(statusFor(kind, mid)).toBe('warning');
    });
  });

  it('classe une valeur juste sous l’alerte en alerte', () => {
    KINDS.forEach((kind) => {
      expect(statusFor(kind, GAS_THRESHOLDS[kind].warning)).toBe('warning');
    });
  });

  it('classe une valeur juste sous l’alarme en critique', () => {
    KINDS.forEach((kind) => {
      expect(statusFor(kind, GAS_THRESHOLDS[kind].alarm - 0.1)).toBe('warning');
      expect(statusFor(kind, GAS_THRESHOLDS[kind].alarm)).toBe('alarm');
    });
  });

  it('ne déclare jamais une mesure absente comme normale', () => {
    KINDS.forEach((kind) => {
      expect(statusFor(kind, null)).toBe('unknown');
      expect(statusFor(kind, Number.NaN)).toBe('unknown');
    });
  });

  it('traite une valeur négative comme une alarme, jamais comme normale', () => {
    KINDS.forEach((kind) => {
      expect(statusFor(kind, -1)).toBe('alarm');
    });
  });

  it('produit toujours un statut connu', () => {
    const known: GasStatus[] = ['normal', 'warning', 'alarm', 'unknown'];
    KINDS.forEach((kind) => {
      [0, 1, 999, 1e9].forEach((value) => {
        expect(known).toContain(statusFor(kind, value));
      });
    });
  });
});
