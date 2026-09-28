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
| 8 | **Compte HiveMQ** | `EXPO_PUBLIC_MQTT_USER` / `PASSWORD` | ⚠️ refusé par le broker |

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
| 1 | **Documentation API** (OpenAPI/JSON ou tableau des endpoints) | écrans dashboard, unités, admin |
| 2 | **Schéma d'authentification** (JWT ? OAuth ? expiration ?) | Firebase Auth ou client HTTP |
| 3 | **`google-services.json`** (Firebase Android) | notifications natives, Firestore |
| 4 | **Modèle de données** : unité, capteur, seuil, alerte | types TypeScript |
| 5 | **Format des rapports** (PDF/CSV) et endpoint d'export | module reporting |
| 6 | Protocole des flux caméras (RTSP, HLS, WebRTC ?) | lecteur vidéo natif |
| 7 | **Règles de permissions** : rôles et actions protégées | `src/utils/permissions.ts` |
| 8 | **Contraintes des formulaires** d'administration | `src/utils/validators.ts` |

> Le broker MQTT, les topics et le format des messages ne sont plus à fournir : la configuration a
> été relevée sur la plateforme web, et le client natif est écrit, testé et compilé. Voir la
> section « Configuration MQTT » plus bas.

---

## ⚠️ Point bloquant : compte HiveMQ Cloud

Le code MQTT est écrit, compilé et testé. Il reste un seul obstacle : **le compte refuse la
connexion**.

Testé depuis cette machine, sur les ports 8884 (WebSocket) et 8883 (TLS) :

```
Connection refused: Not authorized
```

Ce n'est pas un problème de transport ni de réseau : les deux ports acceptent la connexion TCP, un
broker de contrôle (`test.mosquitto.org`) répond correctement, et le message est renvoyé par le
broker lui-même. Le diagnostic a aussi écarté une restriction par `clientId` : neuf préfixes
différents ont été essayés, tous refusés de façon identique.

### Ce qu'il faut vérifier dans la console HiveMQ

Sur le cluster `b7f86ed7` :

1. L'utilisateur `supremia` **existe** et n'a pas été supprimé.
2. Son **statut** est *enabled*, et son **invitation a été acceptée**.
3. L'utilisateur a le droit de **s'abonner** à `supremia/#`. Un utilisateur sans droit
   d'abonnement est refusé dès l'étape CONNECT, avec le même message que pour un mot de passe faux.
4. L'essai n'a pas expiré.

> ⚠️ HiveMQ renvoie un message **identique** pour un mot de passe incorrect et pour un utilisateur
> inexistant. L'erreur ne permet donc pas de distinguer les deux cas.

### Tester après correction

L'app affiche la cause de l'échec : le bandeau rouge « Connexion refusée » indique le motif exact.
Tant que le compte n'est pas réparé, `EXPO_PUBLIC_MQTT_SIMULATE=true` permet d'utiliser et de
démontrer les écrans de supervision.

---

## ✅ Résolu : configuration MQTT

Ces éléments étaient inconnus au départ et ont été relevés sur la plateforme web publique, sans
accéder à vos identifiants.

| Élément | Valeur |
|---|---|
| Broker WebSocket | `wss://b7f86ed758d34f50b801c7ca5e52951e.s1.eu.hivemq.cloud:8884/mqtt` |
| Broker TLS direct | `mqtts://b7f86ed758d34f50b801c7ca5e52951e.s1.eu.hivemq.cloud:8883` |
| Topic | `supremia/#` (donc `supremia/data/<client>`) |
| Client ID | préfixe libre ; l'app utilise `ocp_mobile_*` |
| Client MQTT | mqtt.js 5, `clean: true`, keepalive 60 s, reconnexion toutes les 5 s |
| Champs du payload | `sensor_name`, `sensor_id`, `type`, `location`, `temperature`, `humidity`, `h2s_ppm`, `co_ppm`, `co2_ppm`, `h2s_status`, `co_status`, `co2_status`, `status`, `wifi_rssi`, `publish_count` |

À noter : la plateforme web publique utilisait jusque-là le broker **public** `test.mosquitto.org`,
où n'importe qui pouvait lire *et injecter* de fausses mesures. Le broker privé HiveMQ corrige ce
problème — à condition que le compte soit réparé.

## Utile mais non bloquant

- Maquettes Figma ou captures des écrans à migrer en priorité
- Les comptes de rôle `admin` / `user` pour valider les écrans d'administration
- Règles de seuil validées par votre responsable HSE (voir `src/config/gas.config.ts`)
- Convention de nommage des unités, pour la cohérence des libellés

## ⚠️ Sécurité

- **Ne committez jamais** `.env`, `google-services.json` ni un keystore : ils sont déjà dans
  `.gitignore`.
- Les variables `EXPO_PUBLIC_*` sont **compilées dans l'APK** et donc extractibles. N'y mettez que
  des clés publiques (`EXPO_PUBLIC_FIREBASE_API_KEY` est conçue pour cela) et des URLs.
- Le mot de passe MQTT est donc **extractible de l'APK**. Ce n'est pas un défaut de l'application,
  c'est une propriété des variables `EXPO_PUBLIC_*` : `docs/MQTT_SECURITY.md` détaille la
  séparation de comptes recommandée (publication / abonnement) pour limiter l'impact.
- Les vrais secrets (clés admin, comptes de service côté backend) doivent rester côté serveur.
