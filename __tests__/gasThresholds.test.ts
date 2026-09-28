/**
 * Tests des valeurs limites d'exposition.
 *
 * Ces seuils décident si un site est affiché « conforme » ou « en alerte ».
 * Un test qui passe à tort est plus dangereux qu'un test qui échoue : il
 * valide une absence de détection. Les cas limites sont donc testés
 * explicitement, aux valeurs exactes des seuils et juste en dessous.
 *
 * L'oxygène est le cas particulier : c'est le seul gaz du tableau où un niveau
 * *trop bas* est grave, et où une implémentation « vers le haut uniquement »
 * afficherait 5 % d'oxygène comme normal.
 */

import {
  GAS_THRESHOLDS,
  getAlertLevel,
  isAtLeast,
  resolveGasType,
  type GasType,
} from '@supremia/domain';

describe('GAS_THRESHOLDS', () => {
  const gases = Object.keys(GAS_THRESHOLDS) as GasType[];

  it('classe chaque gaz selon TWA < STEL < IDLH', () => {
    // L'oxygène est exclu : son IDLH (16 %) est un seuil de *déficit*, donc
    // forcément inférieur à la normale atmosphérique. Son ordre est vérifié à
    // part, juste ci-dessous.
    gases
      .filter((gas) => gas !== 'O2')
      .forEach((gas) => {
        const t = GAS_THRESHOLDS[gas];
        expect(t.twa).toBeLessThan(t.stel);
        expect(t.stel).toBeLessThan(t.idlh);
      });
  });

  it('positionne l’oxygène comme un seuil de déficit', () => {
    const o2 = GAS_THRESHOLDS.O2;
    // IDLH bas, puis la normale atmosphérique : c'est l'inverse du reste du
    // tableau, et c'est voulu.
    expect(o2.idlh).toBeLessThan(o2.twa);
    expect(o2.twa).toBeLessThan(o2.stel);
    expect(o2.unit).toBe('%');
  });

  it('donne des seuils positifs et une unité à chaque gaz', () => {
    gases.forEach((gas) => {
      const t = GAS_THRESHOLDS[gas];
      expect(t.twa).toBeGreaterThan(0);
      expect(t.unit.length).toBeGreaterThan(0);
    });
  });

  it('porte les valeurs de référence attendues pour les trois gaz mesurés', () => {
    // Valeurs issues des publications NIOSH. Les figer ici permet de voir
    // immédiatement si quelqu'un modifie un seuil sans le documenter.
    expect(GAS_THRESHOLDS.H2S).toMatchObject({ twa: 10, stel: 15, idlh: 100 });
    expect(GAS_THRESHOLDS.CO).toMatchObject({ twa: 25, stel: 200, idlh: 1200 });
    expect(GAS_THRESHOLDS.CO2).toMatchObject({
      twa: 5000,
      stel: 30000,
      idlh: 40000,
    });
  });
});

describe('getAlertLevel — seuils supérieurs', () => {
  it('classe une valeur sous la VLE comme normale', () => {
    expect(getAlertLevel('H2S', 0)).toBe('normal');
    expect(getAlertLevel('H2S', 9.9)).toBe('normal');
  });

  it('bascule en alerte exactement à la VLE', () => {
    // La borne est inclusive : à 10 ppm on est à la limite d'exposition.
    expect(getAlertLevel('H2S', 10)).toBe('warning');
  });

  it('bascule en critique exactement à la STEL', () => {
    expect(getAlertLevel('H2S', 14.9)).toBe('warning');
    expect(getAlertLevel('H2S', 15)).toBe('critical');
  });

  it('bascule en danger exactement à l’IDLH', () => {
    expect(getAlertLevel('H2S', 99.9)).toBe('critical');
    expect(getAlertLevel('H2S', 100)).toBe('danger');
  });

  it('ne redescend jamais : une valeur extrême reste en danger', () => {
    expect(getAlertLevel('H2S', 100_000)).toBe('danger');
  });
});

describe('getAlertLevel — oxygène', () => {
  it('traite un manque d’oxygène comme un danger', () => {
    // 15 % est un asphyxie sévère : la logique « plus la valeur est haute,
    // plus c’est grave » donnerait ici « normal ».
    expect(getAlertLevel('O2', 15)).toBe('danger');
  });

  it('détecte le déficit critique sous 19,5 %', () => {
    expect(getAlertLevel('O2', 17)).toBe('critical');
  });

  it('détecte un appauvrissement entre 19,5 et 20 %', () => {
    expect(getAlertLevel('O2', 19.8)).toBe('warning');
  });

  it('considère la normale atmosphérique comme normale', () => {
    expect(getAlertLevel('O2', 20.9)).toBe('normal');
    expect(getAlertLevel('O2', 21)).toBe('normal');
  });

  it('signale un excès au-dessus de la STEL', () => {
    expect(getAlertLevel('O2', 23.6)).toBe('warning');
  });
});

describe('getAlertLevel — robustesse', () => {
  it('classe une valeur négative en danger', () => {
    // Un capteur qui publie une valeur aberrante ne doit pas être lu comme sain.
    expect(getAlertLevel('H2S', -1)).toBe('danger');
  });

  it('reste défini pour tous les gaz du tableau', () => {
    (Object.keys(GAS_THRESHOLDS) as GasType[]).forEach((gas) => {
      expect(['normal', 'warning', 'critical', 'danger']).toContain(
        getAlertLevel(gas, 0)
      );
    });
  });
});

describe('resolveGasType', () => {
  it('reconnaît les libellés des capteurs ESP', () => {
    expect(resolveGasType('h2s')).toBe('H2S');
    expect(resolveGasType('h2s_ppm')).toBe('H2S');
    expect(resolveGasType('CO')).toBe('CO');
    expect(resolveGasType('co2')).toBe('CO2');
  });

  it('ignore la casse et les espaces', () => {
    expect(resolveGasType('  CO2 ')).toBe('CO2');
  });

  it('renvoie null pour un gaz inconnu', () => {
    expect(resolveGasType('francium')).toBeNull();
    expect(resolveGasType('')).toBeNull();
  });
});

describe('isAtLeast', () => {
  it('ordonne les niveaux de gravité', () => {
    expect(isAtLeast('danger', 'warning')).toBe(true);
    expect(isAtLeast('critical', 'warning')).toBe(true);
    expect(isAtLeast('warning', 'critical')).toBe(false);
    expect(isAtLeast('normal', 'normal')).toBe(true);
  });
});
