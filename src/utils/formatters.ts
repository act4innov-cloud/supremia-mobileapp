import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(date: string | Date, fmt: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt, { locale: fr });
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}

export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}