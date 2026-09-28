/**
 * Tests du modèle de permissions.
 *
 * ⚠️ EN ATTENTE DE SPÉCIFICATION — le module `src/utils/permissions.ts`
 * n'est pas encore écrit, car les règles dépendent de données que l'application
 * ne possède pas encore :
 *
 *   1. La liste des rôles (administrateur, superviseur, opérateur, lecture
 *      seule ?) et leur hiérarchie.
 *   2. Les actions protégées : consultation, gestion des capteurs, gestion des
 *      utilisateurs, export, configuration, acquisition caméra.
 *   3. La règle d'accès aux unités : nationale, par site, par capteur ?
 *
 * Écrire ces règles sans confirmation reviendrait à inventer une politique de
 * sécurité, alors que le verrouillage ou l'ouverture d'un accès en dépend.
 * Renseignez les points ci-dessus, et ce fichier sera complété en même temps
 * que le module.
 *
 * En attendant, la suite est déclarée vide plutôt qu'absente : Jest échoue sur
 * un fichier de test sans aucun `test`, et ce squelette garde la trace de ce
 * qui reste à faire.
 */
describe.skip('permissions', () => {
  it('à écrire une fois le modèle de rôles validé', () => {
    // Voir l'en-tête du fichier : le contenu dépend des trois points listés.
  });
});
