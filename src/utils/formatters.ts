/** Utilitaires de présentation des relevés. */

/**
 * Formate une concentration en ppm avec une précision adaptée à l'ordre de
 * grandeur : `2.4 ppm` pour le H₂S, `1 024 ppm` pour le CO₂. Une précision
 * fixe inverserait l'ordre de grandeur apparent des deux.
 */
export function formatPpm(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  if (value >= 1000) return Math.round(value).toLocaleString('fr-FR');
  if (value >= 100) return String(Math.round(value));
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

/** Température avec son unité. */
export function formatTemperature(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return `${value.toFixed(1)} °C`;
}

/** Humidité relative. */
export function formatHumidity(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return `${Math.round(value)} %`;
}

/** Puissance Wi-Fi, avec une appréciation qualitative. */
export function formatRssi(value: number | null | undefined): { text: string; quality: string } {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return { text: '—', quality: 'unknown' };
  }
  if (value >= -60) return { text: `${value} dBm`, quality: 'good' };
  if (value >= -75) return { text: `${value} dBm`, quality: 'fair' };
  return { text: `${value} dBm`, quality: 'poor' };
}

/** Ancienneté d'un relevé, en langage courant. */
export function formatAge(timestamp: number, now = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - timestamp) / 1000));
  if (seconds < 5) return "à l'instant";
  if (seconds < 60) return `il y a ${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
}

/** Heure de dernière réception, au format court. */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
