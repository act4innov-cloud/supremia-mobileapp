import { z } from 'zod';

export const emailSchema = z.string().email('Email invalide');
export const passwordSchema = z.string().min(8, 'Min 8 caractères').regex(/[A-Z]/, 'Au moins une majuscule').regex(/[0-9]/, 'Au moins un chiffre');
export const sensorNameSchema = z.string().min(3, 'Min 3 caractères').max(50).regex(/^[A-Z0-9-]+$/, 'Format: LETTRES-CHIFFRES-TIRETS');
export const unitCodeSchema = z.string().regex(/^[A-Z]{3}-\d{2}$/, 'Format: ABC-01');

export function validateEmail(email: string): string | null {
  const result = emailSchema.safeParse(email);
  return result.success ? null : result.error.errors[0].message;
}

export function validatePassword(password: string): string | null {
  const result = passwordSchema.safeParse(password);
  return result.success ? null : result.error.errors[0].message;
}