/**
 * Tests des validateurs de saisie.
 *
 * Ces règles proviennent de la branche `develop`. Les identifiants techniques
 * de capteur et de code d'unité sont testés avec attention : ils sont saisis à
 * la main dans le back-office, et une faute de frappe acceptée crée un capteur
 * fantôme qui n'apparaîtra dans aucune supervision.
 */

import {
  dateRangeSchema,
  emailSchema,
  passwordSchema,
  sensorNameSchema,
  unitCodeSchema,
  validateEmail,
  validatePassword,
  validateSensorName,
  validateUnitCode,
} from '@supremia/domain';

describe('validateEmail', () => {
  it('accepte une adresse professionnelle valide', () => {
    expect(validateEmail('user@ocp.ma')).toBeNull();
    expect(validateEmail('act4innov@gmail.com')).toBeNull();
  });

  it('refuse une adresse sans domaine', () => {
    expect(validateEmail('invalid')).not.toBeNull();
    expect(validateEmail('user@')).not.toBeNull();
    expect(validateEmail('@ocp.ma')).not.toBeNull();
  });

  it('refuse une chaîne vide', () => {
    // Sans ce cas, un champ laissé vide serait traité comme valide.
    expect(validateEmail('')).not.toBeNull();
  });

  it('refuse une adresse avec des espaces', () => {
    expect(validateEmail('utilisateur @ocp.ma')).not.toBeNull();
  });

  it('expose le schéma pour une validation d’objet complète', () => {
    expect(emailSchema.safeParse('user@ocp.ma').success).toBe(true);
  });
});

describe('validatePassword', () => {
  it('accepte un mot de passe robuste', () => {
    expect(validatePassword('Supremia2026!')).toBeNull();
  });

  it('refuse un mot de passe trop court', () => {
    expect(validatePassword('Ab1')).not.toBeNull();
  });

  it('refuse un mot de passe sans majuscule', () => {
    expect(validatePassword('password123')).not.toBeNull();
  });

  it('refuse un mot de passe sans minuscule', () => {
    expect(validatePassword('PASSWORD123')).not.toBeNull();
  });

  it('refuse un mot de passe sans chiffre', () => {
    expect(validatePassword('Password')).not.toBeNull();
  });

  it('refuse un mot de passe vide', () => {
    expect(validatePassword('')).not.toBeNull();
  });
});

describe('validateSensorName', () => {
  it('accepte le format des capteurs ESP', () => {
    expect(validateSensorName('H2S-CLIENT1')).toBeNull();
    expect(validateSensorName('SENSOR-01')).toBeNull();
  });

  it('refuse les minuscules', () => {
    // La casse est normalisée en amont : un capteur `client1` et `CLIENT1`
    // seraient deux capteurs distincts du point de vue des topics MQTT.
    expect(validateSensorName('h2s-client1')).not.toBeNull();
  });

  it('refuse les espaces et les caractères accentués', () => {
    expect(validateSensorName('H2S CLIENT1')).not.toBeNull();
    expect(validateSensorName('H2S-CLIENTÉ')).not.toBeNull();
  });

  it('refuse un nom trop court', () => {
    expect(validateSensorName('A1')).not.toBeNull();
  });

  it('valide le schéma comme la fonction', () => {
    expect(sensorNameSchema.safeParse('H2S-CLIENT1').success).toBe(true);
    expect(sensorNameSchema.safeParse('h2s-client1').success).toBe(false);
  });
});

describe('validateUnitCode', () => {
  it('accepte le format ABC-01', () => {
    expect(validateUnitCode('JFC-01')).toBeNull();
    expect(validateUnitCode('SAP-03')).toBeNull();
  });

  it('refuse un format incorrect', () => {
    expect(validateUnitCode('JFC1')).not.toBeNull();
    expect(validateUnitCode('JFC-001')).not.toBeNull();
    expect(validateUnitCode('JF-01')).not.toBeNull();
    expect(validateUnitCode('jfc-01')).not.toBeNull();
  });

  it('valide le schéma comme la fonction', () => {
    expect(unitCodeSchema.safeParse('JFC-01').success).toBe(true);
    expect(unitCodeSchema.safeParse('JFC1').success).toBe(false);
  });
});

describe('dateRangeSchema', () => {
  it('accepte un intervalle ordonné', () => {
    const result = dateRangeSchema.safeParse({
      start: '2026-01-01',
      end: '2026-01-31',
    });
    expect(result.success).toBe(true);
  });

  it('accepte un intervalle réduit à un seul jour', () => {
    const result = dateRangeSchema.safeParse({
      start: '2026-01-01',
      end: '2026-01-01',
    });
    expect(result.success).toBe(true);
  });

  it('refuse un intervalle inversé', () => {
    // Un rapport sur une période négative ne doit jamais être généré.
    const result = dateRangeSchema.safeParse({
      start: '2026-01-31',
      end: '2026-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('refuse une borne manquante', () => {
    expect(dateRangeSchema.safeParse({ start: '2026-01-01' }).success).toBe(false);
  });
});

describe('passwordSchema', () => {
  it('exige simultanément longueur, majuscule, minuscule et chiffre', () => {
    expect(passwordSchema.safeParse('Supremia2026').success).toBe(true);
    expect(passwordSchema.safeParse('Supremia').success).toBe(false);
    expect(passwordSchema.safeParse('supremia2026').success).toBe(false);
  });
});
