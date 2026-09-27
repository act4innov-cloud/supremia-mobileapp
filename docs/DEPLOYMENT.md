# Déploiement Android

## 1. Compte EAS

```bash
npm install -g eas-cli
eas login
eas build:configure        # écrit l'ID de projet dans app.json
```

Après cette commande, remplacer le `projectId` factice
(`00000000-0000-0000-0000-000000000000`) dans `app.json` par l'ID réel.

## 2. Profils de build

| Profil | Format | Usage |
|---|---|---|
| `development` | APK, client de dev | Tests/debug push notifications sur appareil |
| `preview` | APK | Distribution interne (testeurs) |
| `production` | AAB | Play Store |

## 3. Clé de signature (Play Store)

Pour que les mises à jour futures se fasse **sans désinstaller l'app**, il faut une clé stable.

```bash
keytool -genkey -v -keystore supremia-upload.keystore \
  -alias supremia -keyalg RSA -keysize 2048 -validity 10000
```

Puis, dans `eas.json` (bloc `production`) :

```json
"android": {
  "buildType": "app-bundle"
}
```

EAS gère le keystore pour vous si vous ne fournissez pas le vôtre — c'est recommandé
(le fichier `.keystore` reste alors hors du dépôt, dans le coffre EAS).

> ⚠️ Ne perdez jamais le keystore ni son mot de passe : sans eux, impossible de publier une
> mise à jour de la même application.

## 4. Variables d'environnement par environnement

`eas.json` permet d'injecter une URL différente par profil :

```json
"preview":    { "env": { "EXPO_PUBLIC_WEB_URL": "https://staging.exemple.com" } },
"production": { "env": { "EXPO_PUBLIC_WEB_URL": "https://www.exemple.com" } }
```

## 5. Checklist avant publication

- [ ] `EXPO_PUBLIC_WEB_URL` pointe vers la production (pas staging)
- [ ] Icône et splash réels remplacés dans `src/assets/images/`
- [ ] `version` (semantique) et `android.versionCode` incrémentés
- [ ] Play Console : fiche magasin, captures d'écran, politique de confidentialité
- [ ] `targetSdkVersion` conforme aux exigences Google de l'année en cours
- [ ] Compte de test Google pour les utilisateurs internes (accès à la plateforme)
