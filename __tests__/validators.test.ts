/**
 * Tests de validation des formulaires.
 *
 * ⚠️ EN ATTENTE DE SPÉCIFICATION — le module `src/utils/validators.ts` n'est
 * pas encore écrit. Les règles à valider dépendent du back-office et de
 * l'API de la plateforme, qui ne sont pas documentés :
 *
 *   1. Les champs des formulaires d'administration (capteur, unité, utilisateur)
 *      et leurs contraintes exactes : longueurs, formats, valeurs autorisées.
 *   2. Les règles de l'API : format d'un identifiant capteur, plage de
 *      numéros de téléphone, domaine des adresses e-mail.
 *   3. Les seuils de gaz par capteur, s'ils doivent être surchargeables depuis
 *      l'interface (aujourd'hui ils sont fixes dans `src/config/gas.config.ts`).
 *
 * Valider « correctement » sans ces informations reviendrait à bloquer ou
 * laisser passer des données valides, dans les deux cas grave. Fournissez les
 * contraintes et ce fichier sera écrit avec `validators.ts`.
 */
describe.skip('validators', () => {
  it('à écrire une fois les contraintes des formulaires connues', () => {
    // Voir l'en-tête du fichier : le contenu dépend des trois points listés.
  });
});
