/**
 * Point d'entrée du cœur de domaine SUPREMIA.
 *
 * Ce paquet ne dépend d'aucun framework : ni React, ni Expo, ni MQTT, ni
 * navigateur. Il est donc consommable à l'identique par l'application Android
 * (SDK 57) et par la plateforme web (SDK 52), dont les piles sont trop
 * différentes pour partager autre chose que du TypeScript.
 *
 * Règle à respecter pour que cette propriété reste vraie : ne rien importer
 * ici depuis `react`, `expo-*`, `react-native` ou `@supremia/...`. Un calcul
 * métier qui dépend de l'interface n'est pas du domaine.
 *
 * Origine : règles écrites sur la branche `develop`, partagées depuis.
 */

export * from './types/user';
export * from './types/unit';
export * from './types/camera';
export * from './types/report';

export * from './config/gas';
export * from './config/plants';

export * from './auth/permissions';
export * from './validation/validators';
