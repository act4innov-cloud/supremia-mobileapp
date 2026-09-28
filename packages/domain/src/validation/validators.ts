/**
 * Validation des saisies, par domaine.
 *
 * Les schémas zod sont la source de vérité : les écrans consomment
 * `validateEmail` / `validatePassword` (qui renvoient le message à afficher)
 * alors que les formulaires plus complexes peuvent valider un objet entier avec
 * le schéma exporté. Les deux chemins utilisent donc exactement les mêmes
 * règles, sans duplication.
 *
 * Les motifs sont volontairement stricts sur les identifiants techniques
 * (`SENSOR-01`, `JFC-01`) : ils sont saisis à la main dans l' back-office, et
 * une faute de frappe y crée un capteur fantôme.
 */

import { z } from 'zod';

// --- Utilisateur ------------------------------------------------------------

export const emailSchema = z
  .string()
  .min(1, 'Adresse email requise')
  .email('Adresse email invalide')
  .max(254, 'Adresse email trop longue');

export const passwordSchema = z
  .string()
  .min(8, '8 caractères minimum')
  .regex(/[A-Z]/, 'Au moins une majuscule')
  .regex(/[a-z]/, 'Au moins une minuscule')
  .regex(/[0-9]/, 'Au moins un chiffre');

// --- Objets techniques ------------------------------------------------------

/** Identifiant de capteur : `H2S-CLIENT1`. */
export const sensorNameSchema = z
  .string()
  .min(3, '3 caractères minimum')
  .max(50, '50 caractères maximum')
  .regex(/^[A-Z0-9-]+$/, 'Format attendu : LETTRES-CHIFFRES-TIRETS (ex. H2S-CLIENT1)');

/** Code d'unité de production : `JFC-01`. */
export const unitCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}-\d{2}$/, 'Format attendu : ABC-01 (3 lettres, tiret, 2 chiffres)');

/** Isolation d'un filtre d'intervalle de dates. */
export const dateRangeSchema = z
  .object({
    start: z.string().min(1, 'Date de début requise'),
    end: z.string().min(1, 'Date de fin requise'),
  })
  .refine((range) => range.end >= range.start, {
    message: 'La date de fin doit être postérieure à la date de début',
    path: ['end'],
  });

// --- Fonctions d'usage direct ----------------------------------------------

/** @returns Le message d'erreur, ou `null` si l'email est valide. */
export function validateEmail(email: string): string | null {
  const result = emailSchema.safeParse(email);
  return result.success ? null : result.error.errors[0].message;
}

/** @returns Le message d'erreur, ou `null` si le mot de passe est valide. */
export function validatePassword(password: string): string | null {
  const result = passwordSchema.safeParse(password);
  return result.success ? null : result.error.errors[0].message;
}

/** @returns Le message d'erreur, ou `null` si l'identifiant capteur est valide. */
export function validateSensorName(name: string): string | null {
  const result = sensorNameSchema.safeParse(name);
  return result.success ? null : result.error.errors[0].message;
}

/** @returns Le message d'erreur, ou `null` si le code d'unité est valide. */
export function validateUnitCode(code: string): string | null {
  const result = unitCodeSchema.safeParse(code);
  return result.success ? null : result.error.errors[0].message;
}
