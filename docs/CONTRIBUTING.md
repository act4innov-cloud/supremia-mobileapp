# 🤝 Guide de Contribution - SUPREMIA

## Branches
- `main` - Production stable
- `develop` - Développement actif
- `feature/*` - Nouvelles fonctionnalités
- `fix/*` - Corrections de bugs
- `hotfix/*` - Corrections urgentes

## Conventions
- **Commits** : Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- **Code** : TypeScript strict, ESLint, Prettier
- **Components** : Fichier par composant, export default
- **Naming** : PascalCase (composants), camelCase (fonctions/variables)

## Workflow
1. Créer une branche `feature/nom-feature`
2. Développer + tester localement
3. `npm run lint && npm run type-check && npm test`
4. Pull Request vers `develop`
5. Code review + merge