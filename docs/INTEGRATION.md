# Intégration — ce qu'il faut fournir

Checklist pour brancher cette app sur votre plateforme. Plus c'est rempli vite, plus c'est rapide.

## Minimum pour livrer la v1

| # | Élément | Où l'utiliser | Statut |
|---|---|---|---|
| 1 | **URL de la plateforme** | `EXPO_PUBLIC_WEB_URL` | ✅ `https://suprem-ia.netlify.app` |
| 2 | **Nom affiché** sous l'icône | `EXPO_PUBLIC_APP_DISPLAY_NAME` | ✅ `SUPREMIA` |
| 3 | **Package name** Android | `android.package` dans `app.json` | ✅ `com.supremia.app` |
| 4 | **Couleurs** de la marque | `EXPO_PUBLIC_BRAND_COLOR` / `ACCENT_COLOR` | ✅ `#0B1220` / `#22C55E` |
| 5 | **Logo** | `npm run icons` | ⚠️ intégré depuis `OIG1.jpeg` (351×351, JPEG) |
| 6 | **Compte de test** sur la plateforme | test de l'app | ⏳ de votre côté |
| 7 | **Protection Edge Access** | `EXPO_PUBLIC_INAPP_HOSTS` | ⚠️ voir ci-dessous |

Le fichier `.env` est déjà créé avec les bonnes valeurs (il est ignoré par git, donc non commité).

---

## ⚠️ Point bloquant : Netlify Edge Access

`suprem-ia.netlify.app` est protégé par **Netlify Edge Access**. Toute requête renvoie :

```
HTTP/1.1 401 Unauthorized
Content-Type: text/html
<title>Login Redirect</title>
<script>window.location.href = 'https://app.netlify.com/edge-access?domain=suprem-ia.netlify.app&...'</script>
```

Ce n'est pas le login de votre plateforme (email/mot de passe), c'est un mur d'authentification
Netlify placed en amont de la page.

### Ce que cela implique pour l'app

Par défaut, la WebView renvoie toute navigation vers un autre domaine au navigateur système.
La connexion Edge Access se ferait donc dans Chrome, le cookie de session resterait dans Chrome,
et l'app **bouclerait indéfiniment** sur cet écran sans jamais atteindre le formulaire de votre
plateforme.

**Correctif déjà en place :** `app.netlify.com` est déclaré dans `EXPO_PUBLIC_INAPP_HOSTS`, ce qui
force la connexion à se dérouler dans la WebView. Le cookie est alors stocké par la WebView et
l'app s'ouvre normalement. **C'est ce qui est configuré actuellement.**

### Solution recommandée

Edge Access est conçu pour restreindre un site aux membres d'une équipe, pas à des clients.
Pour une application grand public, il n'est qu'une friction inutile, et il empêchera vos
testeurs d'accéder à l'app tant qu'ils ne sont pas invités dans votre équipe Netlify.

Deux options, par ordre de préférence :

1. **Domaine personnalisé** (le mieux) : associez un vrai domaine, par exemple
   `app.supremia.ma`, et pointez-le sur Netlify. Désactivez ensuite Edge Access dessus. L'app n'a
   plus aucun mur d'authentification et fonctionnera avec le seul login de votre plateforme.
2. **Désactiver le contrôle d'accès** : Netlify → *Site settings* → *Visitor access control* →
   passer de *Require login* à *Disabled*. L'URL `https://supremia.netlify.app` (sans tiret) sert
   actuellement et répond déjà en 200 sans aucune protection.

Dans les deux cas, videz ensuite `EXPO_PUBLIC_INAPP_HOSTS`.

---

## ⚠️ Qualité du logo

`OIG1.jpeg` est un **JPEG 351×351** : c'est une image pleine, sans canal alpha, et son fond n'est
pas uniforme (écart de 118 entre les coins). Conséquences :

- **Aucune transparence possible.** L'icône adaptative (`foreground.png`) est donc rendue opaque et
  en pleine largeur. Sans cela, un rectangle de couleur apparaîtrait à l'intérieur du cercle masqué
  par Android.
- **Résolution faible.** L'image est agrandie ~2,9× pour produire l'icône 1024×1024 : le rendu sera
  légèrement flou, surtout sur les écrans haute densité.
- **Lisibilité.** Sur une icône de launcher de 48 dp, une image aussi détaillée devient difficile à
  identifier. Un symbole plus simple serait plus lisible.

Pour un rendu net, fournissez un **PNG 1024×1024 à fond transparent** : le script basculera
automatiquement en mode `Logo` et produira une icône adaptative correcte, avec la zone sûre
respectée.

```powershell
npm run icons -- --Source "C:\chemin\logo-1024.png"
```


## Pour la Phase 2 (app native)

| # | Élément | Pourquoi |
|---|---|---|
| 7 | **Documentation API** (OpenAPI/JSON ou tableau des endpoints) | écrans dashboard, unités, admin |
| 8 | **Schéma d'authentification** (JWT ? OAuth ? expiration ?) | Firebase Auth ou client HTTP |
| 9 | **`google-services.json`** (Firebase Android) | notifications natives, Firestore |
| 10 | **Broker MQTT** : URL, port, topic racine, identifiants de test | flux capteurs temps réel |
| 11 | **Topics MQTT** + format des messages (payload d'exemple) | parsing dans `useMQTT` |
| 12 | **Modèle de données** : unité, capteur, seuil, alerte | types TypeScript |
| 13 | **Format des rapports** (PDF/CSV) et endpoint d'export | module reporting |
| 14 | Protocole des flux caméras (RTSP, HLS, WebRTC ?) | lecteur vidéo natif |

> La plateforme web utilise déjà du **WebSocket / MQTT**. Pour la Phase 2, l'item 10 est le plus
> important : le broker existe déjà, il suffit d'en connaître l'URL et les topics, qui pourront être
> réutilisés tels quels par le client natif.

## Utile mais non bloquant

- Maquettes Figma ou captures des écrans à migrer en priorité
- Les comptes de rôle `admin` / `user` pour valider les écrans d'administration
- Règles de seuil et convention de nommage des unités (pour la cohérence des libellés)

## ⚠️ Sécurité

- **Ne committez jamais** `.env`, `google-services.json` ni un keystore : ils sont déjà dans
  `.gitignore`.
- Les variables `EXPO_PUBLIC_*` sont **compilées dans l'APK** et donc extractibles. N'y mettez que
  des clés publiques (`EXPO_PUBLIC_FIREBASE_API_KEY` est conçue pour cela) et des URLs.
- Les vrais secrets (mot de passe MQTT, clés admin côté serveur) doivent rester côté backend.
