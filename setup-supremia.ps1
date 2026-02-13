<#
============================================================
 🏭 SUPREMIA Platform — Création Complète du Repo
============================================================
 Repository : https://github.com/act4innov-cloud/supremia-mobileapp
 Fichiers   : 137
 Dossiers   : 34

 USAGE :
   1. Ouvrir PowerShell en tant qu'Administrateur
   2. Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   3. cd C:\Users\VotreNom\Projects   (ou votre workspace)
   4. .\setup-supremia.ps1

 Le script va :
   ✅ Cloner le repo GitHub
   ✅ Créer les 34 dossiers
   ✅ Créer les 137 fichiers vides avec les bons noms/chemins
   ✅ Afficher les instructions pour la suite
============================================================
#>

$ErrorActionPreference = "Stop"

# ══════════════════════════════════════════════════
# CONFIGURATION
# ══════════════════════════════════════════════════
$REPO_URL  = "https://github.com/act4innov-cloud/supremia-mobileapp.git"
$REPO_NAME = "supremia-mobileapp"

# ══════════════════════════════════════════════════
# BANNER
# ══════════════════════════════════════════════════
Write-Host ""
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  🏭  SUPREMIA Platform — Setup Complet du Repo       " -ForegroundColor Cyan
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  📦 Repo   : $REPO_URL" -ForegroundColor Gray
Write-Host "  📁 Cible  : ./$REPO_NAME" -ForegroundColor Gray
Write-Host "  📊 Total  : 34 dossiers + 137 fichiers" -ForegroundColor Gray
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# ══════════════════════════════════════════════════
# ÉTAPE 1 : Cloner le repo (ou créer le dossier)
# ══════════════════════════════════════════════════
Write-Host "[1/5] 📥 Clonage du repository..." -ForegroundColor Yellow

if (Test-Path $REPO_NAME) {
    Write-Host "  ⚠️  Le dossier '$REPO_NAME' existe déjà." -ForegroundColor DarkYellow
    $choice = Read-Host "  Voulez-vous le supprimer et recloner ? (o/N)"
    if ($choice -eq "o" -or $choice -eq "O") {
        Remove-Item -Recurse -Force $REPO_NAME
        git clone $REPO_URL
    } else {
        Write-Host "  → Utilisation du dossier existant" -ForegroundColor Gray
    }
} else {
    # Essayer de cloner, sinon créer le dossier vide
    try {
        git clone $REPO_URL
        Write-Host "  ✅ Repo cloné avec succès" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Git clone échoué, création du dossier manuellement..." -ForegroundColor DarkYellow
        New-Item -ItemType Directory -Path $REPO_NAME -Force | Out-Null
    }
}

Set-Location $REPO_NAME

# ══════════════════════════════════════════════════
# ÉTAPE 2 : Créer les 34 dossiers
# ══════════════════════════════════════════════════
Write-Host ""
Write-Host "[2/5] 📁 Création des 34 dossiers..." -ForegroundColor Yellow

$directories = @(
    ".idx",
    ".github",
    ".github/workflows",
    "__tests__",
    "app",
    "app/(auth)",
    "app/(tabs)",
    "app/(tabs)/admin",
    "app/(tabs)/cameras",
    "app/(tabs)/dashboard",
    "app/(tabs)/reporting",
    "app/(tabs)/sensors",
    "docs",
    "scripts",
    "src",
    "src/assets",
    "src/assets/fonts",
    "src/assets/icons",
    "src/assets/images",
    "src/components",
    "src/components/admin",
    "src/components/cameras",
    "src/components/common",
    "src/components/dashboard",
    "src/components/reporting",
    "src/components/sensors",
    "src/config",
    "src/contexts",
    "src/hooks",
    "src/services",
    "src/stores",
    "src/types",
    "src/utils"
)

$dirCount = 0
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $dirCount++
}
Write-Host "  ✅ $dirCount dossiers vérifiés/créés" -ForegroundColor Green

# ══════════════════════════════════════════════════
# ÉTAPE 3 : Créer les 137 fichiers
# ══════════════════════════════════════════════════
Write-Host ""
Write-Host "[3/5] 📝 Création des 137 fichiers..." -ForegroundColor Yellow

$files = @(
    # ── Racine : Configuration (15 fichiers) ──
    ".env.example",
    ".eslintrc.js",
    ".firebaserc",
    ".gitignore",
    ".prettierrc",
    "README.md",
    "app.json",
    "babel.config.js",
    "eas.json",
    "firebase.json",
    "firestore.indexes.json",
    "firestore.rules",
    "jest.config.js",
    "metro.config.js",
    "package.json",
    "tsconfig.json",

    # ── Firebase Studio (1 fichier) ──
    ".idx/dev.nix",

    # ── CI/CD (2 fichiers) ──
    ".github/workflows/ci.yml",
    ".github/workflows/deploy.yml",

    # ── Scripts (2 fichiers) ──
    "scripts/create-admin.js",
    "scripts/seed-firestore.js",

    # ── Tests (4 fichiers) ──
    "__tests__/formatters.test.ts",
    "__tests__/gasCalculations.test.ts",
    "__tests__/permissions.test.ts",
    "__tests__/setup.ts",
    "__tests__/validators.test.ts",

    # ── App : Root (2 fichiers) ──
    "app/_layout.tsx",
    "app/index.tsx",

    # ── App : Auth (4 fichiers) ──
    "app/(auth)/_layout.tsx",
    "app/(auth)/forgot-password.tsx",
    "app/(auth)/login.tsx",
    "app/(auth)/register.tsx",

    # ── App : Tabs Layout (1 fichier) ──
    "app/(tabs)/_layout.tsx",

    # ── App : Dashboard (3 fichiers) ──
    "app/(tabs)/dashboard/_layout.tsx",
    "app/(tabs)/dashboard/index.tsx",
    "app/(tabs)/dashboard/[unitId].tsx",

    # ── App : Sensors (3 fichiers) ──
    "app/(tabs)/sensors/_layout.tsx",
    "app/(tabs)/sensors/index.tsx",
    "app/(tabs)/sensors/[sensorId].tsx",

    # ── App : Cameras (3 fichiers) ──
    "app/(tabs)/cameras/_layout.tsx",
    "app/(tabs)/cameras/index.tsx",
    "app/(tabs)/cameras/[cameraId].tsx",

    # ── App : Reporting (3 fichiers) ──
    "app/(tabs)/reporting/_layout.tsx",
    "app/(tabs)/reporting/index.tsx",
    "app/(tabs)/reporting/archive.tsx",

    # ── App : Admin (6 fichiers) ──
    "app/(tabs)/admin/_layout.tsx",
    "app/(tabs)/admin/index.tsx",
    "app/(tabs)/admin/units.tsx",
    "app/(tabs)/admin/sensors.tsx",
    "app/(tabs)/admin/users.tsx",
    "app/(tabs)/admin/settings.tsx",

    # ── Components : Common (7 fichiers) ──
    "src/components/common/index.ts",
    "src/components/common/AlertBadge.tsx",
    "src/components/common/Button.tsx",
    "src/components/common/Card.tsx",
    "src/components/common/Header.tsx",
    "src/components/common/LoadingSpinner.tsx",
    "src/components/common/StatusIndicator.tsx",

    # ── Components : Dashboard (6 fichiers) ──
    "src/components/dashboard/index.ts",
    "src/components/dashboard/AlertsWidget.tsx",
    "src/components/dashboard/HealthGauge.tsx",
    "src/components/dashboard/PlantOverview.tsx",
    "src/components/dashboard/SensorMiniChart.tsx",
    "src/components/dashboard/UnitCard.tsx",

    # ── Components : Sensors (6 fichiers) ──
    "src/components/sensors/index.ts",
    "src/components/sensors/GasLevelIndicator.tsx",
    "src/components/sensors/SensorCard.tsx",
    "src/components/sensors/SensorChart.tsx",
    "src/components/sensors/SensorMap.tsx",
    "src/components/sensors/ThresholdBar.tsx",

    # ── Components : Cameras (5 fichiers) ──
    "src/components/cameras/index.ts",
    "src/components/cameras/CameraFeed.tsx",
    "src/components/cameras/CameraGrid.tsx",
    "src/components/cameras/PTZControls.tsx",
    "src/components/cameras/PresetSelector.tsx",

    # ── Components : Reporting (5 fichiers) ──
    "src/components/reporting/index.ts",
    "src/components/reporting/ChartWidget.tsx",
    "src/components/reporting/DateRangePicker.tsx",
    "src/components/reporting/ExportButton.tsx",
    "src/components/reporting/ReportCard.tsx",

    # ── Components : Admin (5 fichiers) ──
    "src/components/admin/index.ts",
    "src/components/admin/DashboardEditor.tsx",
    "src/components/admin/SensorForm.tsx",
    "src/components/admin/UnitForm.tsx",
    "src/components/admin/UserRoleManager.tsx",

    # ── Config (5 fichiers) ──
    "src/config/index.ts",
    "src/config/app.config.ts",
    "src/config/firebase.config.ts",
    "src/config/gas.config.ts",
    "src/config/mqtt.config.ts",

    # ── Contexts (4 fichiers) ──
    "src/contexts/index.ts",
    "src/contexts/AuthContext.tsx",
    "src/contexts/MQTTContext.tsx",
    "src/contexts/ThemeContext.tsx",

    # ── Hooks (8 fichiers) ──
    "src/hooks/index.ts",
    "src/hooks/useAlerts.ts",
    "src/hooks/useAuth.ts",
    "src/hooks/useCameras.ts",
    "src/hooks/useDashboard.ts",
    "src/hooks/useMQTT.ts",
    "src/hooks/useReporting.ts",
    "src/hooks/useSensors.ts",

    # ── Services (8 fichiers) ──
    "src/services/index.ts",
    "src/services/auth.ts",
    "src/services/camera.ts",
    "src/services/firebase.ts",
    "src/services/firestore.ts",
    "src/services/mqtt.ts",
    "src/services/notifications.ts",
    "src/services/storage.ts",

    # ── Stores (5 fichiers) ──
    "src/stores/index.ts",
    "src/stores/alertStore.ts",
    "src/stores/dashboardStore.ts",
    "src/stores/sensorStore.ts",
    "src/stores/settingsStore.ts",

    # ── Types (8 fichiers) ──
    "src/types/index.ts",
    "src/types/camera.types.ts",
    "src/types/dashboard.types.ts",
    "src/types/mqtt.types.ts",
    "src/types/report.types.ts",
    "src/types/sensor.types.ts",
    "src/types/unit.types.ts",
    "src/types/user.types.ts",

    # ── Utils (6 fichiers) ──
    "src/utils/index.ts",
    "src/utils/colors.ts",
    "src/utils/formatters.ts",
    "src/utils/gasCalculations.ts",
    "src/utils/permissions.ts",
    "src/utils/validators.ts",

    # ── Assets (3 fichiers) ──
    "src/assets/fonts/.gitkeep",
    "src/assets/icons/.gitkeep",
    "src/assets/images/.gitkeep",

    # ── Documentation (5 fichiers) ──
    "docs/API_REFERENCE.md",
    "docs/ARCHITECTURE.md",
    "docs/CONTRIBUTING.md",
    "docs/DEPLOYMENT.md",
    "docs/MQTT_TOPICS.md"
)

$fileCount = 0
$skipped = 0
foreach ($file in $files) {
    # Créer le dossier parent si nécessaire
    $parentDir = Split-Path $file -Parent
    if ($parentDir -and !(Test-Path $parentDir)) {
        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
    }
    # Créer le fichier s'il n'existe pas
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file -Force | Out-Null
        $fileCount++
    } else {
        $skipped++
    }
}

Write-Host "  ✅ $fileCount fichiers créés" -ForegroundColor Green
if ($skipped -gt 0) {
    Write-Host "  ⏩ $skipped fichiers existants ignorés" -ForegroundColor DarkYellow
}

# ══════════════════════════════════════════════════
# ÉTAPE 4 : Vérification
# ══════════════════════════════════════════════════
Write-Host ""
Write-Host "[4/5] 🔍 Vérification..." -ForegroundColor Yellow

$totalFiles = (Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notlike '*\.git\*' -and $_.FullName -notlike '*node_modules*' }).Count
$totalDirs = (Get-ChildItem -Recurse -Directory | Where-Object { $_.FullName -notlike '*\.git\*' -and $_.FullName -notlike '*node_modules*' }).Count

Write-Host "  📊 Dossiers : $totalDirs / 34 attendus" -ForegroundColor $(if ($totalDirs -ge 34) { "Green" } else { "Red" })
Write-Host "  📊 Fichiers : $totalFiles / 137 attendus" -ForegroundColor $(if ($totalFiles -ge 137) { "Green" } else { "Red" })

# Vérifier les fichiers critiques
$criticalFiles = @(
    "package.json", "app.json", "tsconfig.json", "firebase.json",
    "firestore.rules", ".idx/dev.nix", "app/_layout.tsx",
    "src/config/firebase.config.ts", "src/contexts/AuthContext.tsx"
)
$missing = @()
foreach ($cf in $criticalFiles) {
    if (!(Test-Path $cf)) { $missing += $cf }
}
if ($missing.Count -gt 0) {
    Write-Host "  ⚠️  Fichiers critiques manquants : $($missing -join ', ')" -ForegroundColor Red
} else {
    Write-Host "  ✅ Tous les fichiers critiques présents" -ForegroundColor Green
}

# ══════════════════════════════════════════════════
# ÉTAPE 5 : Résumé & Instructions
# ══════════════════════════════════════════════════
Write-Host ""
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  ✅ ARBORESCENCE CRÉÉE AVEC SUCCÈS !                 " -ForegroundColor Green
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📁 Arborescence du projet :" -ForegroundColor White
Write-Host ""
Write-Host "  supremia-mobileapp/" -ForegroundColor Cyan
Write-Host "  ├── .idx/dev.nix                    # Firebase Studio" -ForegroundColor Gray
Write-Host "  ├── .github/workflows/               # CI/CD" -ForegroundColor Gray
Write-Host "  ├── app/                              # 25 screens (Expo Router)" -ForegroundColor Gray
Write-Host "  │   ├── (auth)/                       #   login, register, forgot" -ForegroundColor DarkGray
Write-Host "  │   └── (tabs)/                       #   dashboard, sensors, cameras..." -ForegroundColor DarkGray
Write-Host "  │       ├── admin/                    #   units, sensors, users, settings" -ForegroundColor DarkGray
Write-Host "  │       ├── cameras/" -ForegroundColor DarkGray
Write-Host "  │       ├── dashboard/" -ForegroundColor DarkGray
Write-Host "  │       ├── reporting/" -ForegroundColor DarkGray
Write-Host "  │       └── sensors/" -ForegroundColor DarkGray
Write-Host "  ├── src/                              # 78 fichiers source" -ForegroundColor Gray
Write-Host "  │   ├── components/ (34)              #   common, dashboard, sensors..." -ForegroundColor DarkGray
Write-Host "  │   ├── config/ (5)                   #   app, firebase, gas, mqtt" -ForegroundColor DarkGray
Write-Host "  │   ├── contexts/ (4)                 #   Auth, MQTT, Theme" -ForegroundColor DarkGray
Write-Host "  │   ├── hooks/ (8)                    #   useAuth, useSensors..." -ForegroundColor DarkGray
Write-Host "  │   ├── services/ (8)                 #   firebase, mqtt, camera..." -ForegroundColor DarkGray
Write-Host "  │   ├── stores/ (5)                   #   Zustand stores" -ForegroundColor DarkGray
Write-Host "  │   ├── types/ (8)                    #   TypeScript types" -ForegroundColor DarkGray
Write-Host "  │   ├── utils/ (6)                    #   gasCalc, formatters..." -ForegroundColor DarkGray
Write-Host "  │   └── assets/                       #   icons, images, fonts" -ForegroundColor DarkGray
Write-Host "  ├── scripts/                          # seed, create-admin" -ForegroundColor Gray
Write-Host "  ├── docs/                             # 5 docs (ARCHITECTURE, MQTT...)" -ForegroundColor Gray
Write-Host "  ├── __tests__/                        # 5 test files" -ForegroundColor Gray
Write-Host "  ├── firebase.json                     # Hosting + Firestore config" -ForegroundColor Gray
Write-Host "  ├── firestore.rules                   # Règles sécurité RBAC" -ForegroundColor Gray
Write-Host "  └── package.json                      # Dépendances" -ForegroundColor Gray
Write-Host ""
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  📌 PROCHAINES ÉTAPES :                              " -ForegroundColor Yellow
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1️⃣  Ouvrir le fichier SUPREMIA_SOURCE_CODE_COMPLET_V2.md" -ForegroundColor White
Write-Host "     dans votre navigateur ou VS Code" -ForegroundColor Gray
Write-Host ""
Write-Host "  2️⃣  Pour chaque fichier dans le .md :" -ForegroundColor White
Write-Host "     → Copier le code" -ForegroundColor Gray
Write-Host "     → Coller dans le fichier vide correspondant" -ForegroundColor Gray
Write-Host "     → Sauvegarder (Ctrl+S)" -ForegroundColor Gray
Write-Host ""
Write-Host "  3️⃣  Initialiser le projet :" -ForegroundColor White
Write-Host "     npm install" -ForegroundColor Green
Write-Host "     copy .env.example .env" -ForegroundColor Green
Write-Host "     # Éditer .env avec vos clés Firebase" -ForegroundColor Gray
Write-Host ""
Write-Host "  4️⃣  Lancer l'app :" -ForegroundColor White
Write-Host "     npx expo start --web" -ForegroundColor Green
Write-Host ""
Write-Host "  5️⃣  Push vers GitHub :" -ForegroundColor White
Write-Host "     git add ." -ForegroundColor Green
Write-Host "     git commit -m `"feat: SUPREMIA platform complete setup`"" -ForegroundColor Green
Write-Host "     git push origin main" -ForegroundColor Green
Write-Host ""
Write-Host "  6️⃣  Ouvrir dans Firebase Studio :" -ForegroundColor White
Write-Host "     → firebase.studio → Import → $REPO_URL" -ForegroundColor Green
Write-Host ""
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  🚀 SUPREMIA Platform © 2026 ACT4INNOV — OCP Morocco" -ForegroundColor DarkGray
Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
