/**
 * Tests de la logique de traitement des messages MQTT.
 *
 * C'est la partie la plus critique de l'application : une erreur de parsing
 * afficherait une valeur fausse, donc un site « conforme » à tort. Ces tests
 * utilisent des payloads au format exact produit par le firmware ESP, repris
 * depuis le code de la plateforme web.
 */

import { parseMessage, toReading } from '~/services/mqtt';
import { GAS_THRESHOLDS } from '~/config/gas.config';
import { normalizeStatus, statusFor } from '~/utils/gasCalculations';

/** Payload réel, format confirmé par la plateforme web. */
const PAYLOAD_VALIDE = {
  sensor_name: 'client1',
  sensor_id: 1,
  type: 'ESP8266',
  location: 'Bâtiment A',
  temperature: 27.4,
  humidity: 41.2,
  h2s_ppm: 3.2,
  co_ppm: 6,
  co2_ppm: 820,
  h2s_status: 'normal',
  co_status: 'normal',
  co2_status: 'normal',
  status: 'online',
  wifi_rssi: -58,
  publish_count: 1234,
};

describe('analyse des messages MQTT', () => {
  describe('parseMessage', () => {
    it('convertit un payload JSON en relevé complet', () => {
      const reading = parseMessage(
        'supremia/data/client1',
        JSON.stringify(PAYLOAD_VALIDE),
        1_700_000_000_000,
      );

      expect(reading).not.toBeNull();
      expect(reading?.name).toBe('client1');
      expect(reading?.location).toBe('Bâtiment A');
      expect(reading?.deviceType).toBe('ESP8266');
      expect(reading?.temperature).toBe(27.4);
      expect(reading?.humidity).toBe(41.2);
      expect(reading?.wifiRssi).toBe(-58);
      expect(reading?.publishCount).toBe(1234);
      expect(reading?.lastSeen).toBe(1_700_000_000_000);
    });

    it('accepte un payload binaire (Uint8Array)', () => {
      const bytes = new TextEncoder().encode(JSON.stringify(PAYLOAD_VALIDE));
      const reading = parseMessage('supremia/data/client1', bytes);
      expect(reading?.name).toBe('client1');
    });

    it('ignore un message qui n’est pas du JSON', () => {
      expect(parseMessage('supremia/data/client1', 'pas du json')).toBeNull();
    });

    it('ignore un JSON qui n’est pas un objet', () => {
      expect(parseMessage('supremia/data/client1', '42')).toBeNull();
      expect(parseMessage('supremia/data/client1', 'null')).toBeNull();
      expect(parseMessage('supremia/data/client1', '"chaine"')).toBeNull();
    });

    it('déduit le nom du capteur depuis le topic si le payload n’en a pas', () => {
      const { sensor_name: _ignoré, ...sansNom } = PAYLOAD_VALIDE;
      const reading = parseMessage(
        'supremia/data/client7',
        JSON.stringify(sansNom),
        1_700_000_000_000,
      );
      expect(reading?.name).toBe('client7');
    });
  });

  describe('seuillage des gaz', () => {
    it('classe une valeur selon les seuils configurés', () => {
      const cas: Array<[number, string]> = [
        [0, 'normal'],
        [9.99, 'normal'],
        [10, 'warning'],
        [19.99, 'warning'],
        [20, 'alarm'],
        [100, 'alarm'],
      ];
      for (const [valeur, attendu] of cas) {
        expect(statusFor('h2s', valeur)).toBe(attendu);
      }
    });

    it('applique les seuils propres à chaque gaz', () => {
      // 200 ppm est critique pour le CO (seuil 50) mais normal pour le CO2
      // (seuil d’alerte 1 000).
      expect(statusFor('co', 200)).toBe('alarm');
      expect(statusFor('co2', 200)).toBe('normal');
    });

    it('considère une valeur absente comme inconnue, jamais comme normale', () => {
      expect(statusFor('h2s', null)).toBe('unknown');
      expect(statusFor('h2s', NaN)).toBe('unknown');
    });

    it('porte les seuils dans le relevé, pour l’affichage', () => {
      const reading = toReading(PAYLOAD_VALIDE, 'supremia/data/client1', 1);
      expect(reading.gases.h2s.warningLimit).toBe(GAS_THRESHOLDS.h2s.warning);
      expect(reading.gases.h2s.alarmLimit).toBe(GAS_THRESHOLDS.h2s.alarm);
      expect(reading.gases.h2s.unit).toBe('ppm');
    });
  });

  describe('statut global du capteur', () => {
    it('prend le pire statut parmi les trois gaz', () => {
      const base = { ...PAYLOAD_VALIDE, h2s_ppm: 2, co_ppm: 2, co2_ppm: 400 };
      expect(toReading(base, 'supremia/data/client1', 1).status).toBe('normal');
      expect(toReading({ ...base, co_ppm: 60 }, 'supremia/data/client1', 1).status).toBe('alarm');
      expect(toReading({ ...base, co_ppm: 30 }, 'supremia/data/client1', 1).status).toBe(
        'warning',
      );
    });

    it('ignore un topic de statut, qui ne porte pas de mesures', () => {
      const reading = toReading(
        { sensor_name: 'client1', status: 'online' },
        'supremia/status/client1',
        1,
      );
      expect(reading.status).toBe('unknown');
    });
  });

  describe('normalisation du statut annoncé par le capteur', () => {
    it('reconnaît les variantes textuelles', () => {
      expect(normalizeStatus('ok')).toBe('normal');
      expect(normalizeStatus('NORMAL')).toBe('normal');
      expect(normalizeStatus('warning')).toBe('warning');
      expect(normalizeStatus('Critique')).toBe('alarm');
      expect(normalizeStatus(0)).toBe('normal');
      expect(normalizeStatus(2)).toBe('alarm');
    });

    it('retourne inconnu pour un vocabulaire non reconnu', () => {
      expect(normalizeStatus('peut-etre')).toBe('unknown');
      expect(normalizeStatus(undefined)).toBe('unknown');
      expect(normalizeStatus('')).toBe('unknown');
    });

    it('n’utilise jamais le statut annoncé pour piloter l’affichage', () => {
      // Le capteur affirme « ok » alors que la mesure est critique : c'est la
      // mesure qui doit l'emporter, sinon un capteur mal configuré masque une
      // alerte de sécurité.
      const reading = toReading(
        { ...PAYLOAD_VALIDE, h2s_ppm: 45, h2s_status: 'ok' },
        'supremia/data/client1',
        1,
      );
      expect(reading.status).toBe('alarm');
      expect(reading.gases.h2s.reportedStatus).toBe('normal');
    });
  });

  describe('robustesse aux payloads partiels', () => {
    it('accepte un capteur qui n’envoie que le nom et le H2S', () => {
      const reading = parseMessage(
        'supremia/data/client2',
        JSON.stringify({ sensor_name: 'client2', h2s_ppm: 12 }),
        1,
      );
      expect(reading?.name).toBe('client2');
      expect(reading?.gases.h2s.value).toBe(12);
      expect(reading?.gases.h2s.status).toBe('warning');
      // Les gaz absents restent inconnus, pas à zéro : afficher 0 ppm pour un
      // capteur qui ne mesure pas le CO serait un mensonge de sécurité.
      expect(reading?.gases.co.value).toBeNull();
      expect(reading?.gases.co.status).toBe('unknown');
    });

    it('accepte des valeurs numériques envoyées en chaîne', () => {
      const reading = parseMessage(
        'supremia/data/client1',
        JSON.stringify({ sensor_name: 'client1', h2s_ppm: '15.5' }),
        1,
      );
      expect(reading?.gases.h2s.value).toBe(15.5);
    });

    it('rejette les valeurs non numériques sans planter', () => {
      const reading = parseMessage(
        'supremia/data/client1',
        JSON.stringify({ sensor_name: 'client1', h2s_ppm: 'N/A' }),
        1,
      );
      expect(reading?.gases.h2s.value).toBeNull();
      expect(reading?.gases.h2s.status).toBe('unknown');
    });

    it('complète les champs manquants par des valeurs neutres', () => {
      const reading = parseMessage('supremia/data/client1', JSON.stringify({}), 1);
      expect(reading?.location).toBe('Non renseignée');
      expect(reading?.deviceType).toBe('ESP');
    });
  });
});
