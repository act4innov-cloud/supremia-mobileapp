<#
.SYNOPSIS
  Génère les quatre assets d'icône Android à partir d'un logo source unique.

.DESCRIPTION
  Expo a besoin de :
    icon.png          1024x1024  icône du launcher
    adaptive-icon.png 1024x1024  aperçu avant Android 8
    foreground.png    1024x1024  icône adaptative (Android 8+)
    splash-icon.png    512x512   écran de démarrage

  Deux modes sont appliqués automatiquement :

  Mode "logo"  — le source a un fond transparent ou uni (PNG).
    Le logo est réduit et centré, foreground et splash sont transparents.
    Correct pour une icône adaptative : Android conserve le cercle central,
    le logo est donc réduit à 62 %.

  Mode "image" — le source est une image pleine (JPEG, ou fond non uniforme).
    Aucune transparence n'est possible : tout est rendu opaque et pleine
    largeur ("full bleed"), sinon un rectangle de couleur apparaîtrait à
    l'intérieur du cercle de l'icône adaptative.

.PARAMETER Source
  Chemin du logo. PNG/JPG acceptés. 512x1024 minimum recommandé.

.PARAMETER Background
  Couleur de fond au format #RRGGBB. Par défaut, échantillonnée sur les coins
  du source. Ignorée en mode "image" pour foreground/icon/adaptive.

.PARAMETER Mode
  Force le mode : Auto (défaut), Logo ou Image.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/set-icon.ps1 -Source "D:\logo\OIG1.jpeg"
  powershell -ExecutionPolicy Bypass -File scripts/set-icon.ps1 -Source .\logo.png -Mode Logo
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][string]$Source,
  [string]$Background = '',
  [ValidateSet('Auto', 'Logo', 'Image')][string]$Mode = 'Auto'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot '..\src\assets\images'
$outDir = (Resolve-Path -LiteralPath $outDir).Path

if (-not (Test-Path -LiteralPath $Source)) { throw "Logo introuvable : $Source" }
$Source = (Resolve-Path -LiteralPath $Source).Path

# --- Détection du mode ------------------------------------------------------
$isJpeg = [System.IO.Path]::GetExtension($Source).ToLower() -in @('.jpg', '.jpeg')

$probe = [System.Drawing.Image]::FromFile($Source)
$probeBmp = New-Object System.Drawing.Bitmap $probe
$w = $probeBmp.Width
$h = $probeBmp.Height
$coins = @(
  $probeBmp.GetPixel(1, 1),
  $probeBmp.GetPixel($w - 2, 1),
  $probeBmp.GetPixel(1, $h - 2),
  $probeBmp.GetPixel($w - 2, $h - 2)
)
$avgR = ($coins | Measure-Object R -Average).Average
$avgG = ($coins | Measure-Object G -Average).Average
$avgB = ($coins | Measure-Object B -Average).Average
$deviation = ($coins | ForEach-Object {
    [math]::Abs($_.R - $avgR) + [math]::Abs($_.G - $avgG) + [math]::Abs($_.B - $avgB)
} | Measure-Object -Maximum).Maximum
$uniformBorder = $deviation -lt 30
$probeBmp.Dispose()
$probe.Dispose()

if ($Mode -eq 'Auto') {
  $resolvedMode = if ($isJpeg -or -not $uniformBorder) { 'Image' } else { 'Logo' }
} else {
  $resolvedMode = $Mode
}

# --- Couleur de fond --------------------------------------------------------
if ([string]::IsNullOrWhiteSpace($Background)) {
  $hex = '{0:X2}{1:X2}{2:X2}' -f [int]$avgR, [int]$avgG, [int]$avgB
  $Background = "#$hex"
}
$hex = $Background.TrimStart('#')
if ($hex.Length -ne 6) { throw "Format de couleur invalide : $Background (attendu #RRGGBB)" }
$bgColor = [System.Drawing.Color]::FromArgb(
  [Convert]::ToInt32($hex.Substring(0, 2), 16),
  [Convert]::ToInt32($hex.Substring(2, 2), 16),
  [Convert]::ToInt32($hex.Substring(4, 2), 16)
)

Write-Host "Source      : $Source"
Write-Output "Dimensions  : ${w}x${h}"
Write-Host "Mode        : $resolvedMode  $(if ($resolvedMode -eq 'Image') { '(image pleine : rendu opaque pleine largeur)' } else { '(logo : fond transparent, zone sure respectee)' })"
Write-Host "Fond        : $Background  (ecart des coins : $([int]$deviation))"
Write-Host "Destination : $outDir"
Write-Host ''

$logo = [System.Drawing.Image]::FromFile($Source)

function New-Icon {
  param(
    [int]$Size,
    [bool]$Opaque,
    [ValidateSet('Cover', 'Contain')][string]$Fit = 'Contain',
    [double]$Scale = 0.78
  )

  $bmp = New-Object System.Drawing.Bitmap($Size, $size)
  $bmp.SetResolution(96, 96)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

  if ($Opaque) { $g.Clear($bgColor) } else { $g.Clear([System.Drawing.Color]::Transparent) }

  $ratio = $logo.Width / $logo.Height
  if ($Fit -eq 'Cover') {
    # Remplit tout le canevas, recadre ce qui dépasse (pas de bord visible).
    if ($ratio -gt 1) {
      $dh = $Size; $dw = [int]($Size * $ratio); $dx = [int](($Size - $dw) / 2); $dy = 0
    } else {
      $dw = $Size; $dh = [int]($Size / $ratio); $dx = 0; $dy = [int](($Size - $dh) / 2)
    }
    $g.DrawImage($logo, $dx, $dy, $dw, $dh)
  } else {
    $side = [int]($Size * $Scale)
    if ($ratio -gt 1) {
      $dw = $side; $dh = [int]($side / $ratio)
    } else {
      $dh = $side; $dw = [int]($side * $ratio)
    }
    $x = [int](($Size - $dw) / 2)
    $y = [int](($Size - $dh) / 2)
    $g.DrawImage($logo, $x, $y, $dw, $dh)
  }

  return @($bmp, $g)
}

function Save-Icon {
  param($Bitmap, $Graphics, [string]$Name)
  $path = Join-Path $outDir $Name
  $Graphics.Dispose()
  $Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $Bitmap.Dispose()
  Write-Output ("  {0,-20} {1,4} Ko" -f $Name, [math]::Round((Get-Item -LiteralPath $path).Length / 1KB))
}

try {
  if ($resolvedMode -eq 'Image') {
    # Pleine largeur : indispensable, un JPEG n'a pas de canal alpha.
    $c = New-Icon -Size 1024 -Opaque $true  -Fit Cover;   Save-Icon $c[0] $c[1] 'icon.png'
    $c = New-Icon -Size 1024 -Opaque $true  -Fit Cover;   Save-Icon $c[0] $c[1] 'adaptive-icon.png'
    $c = New-Icon -Size 1024 -Opaque $true  -Fit Cover;   Save-Icon $c[0] $c[1] 'foreground.png'
    $c = New-Icon -Size 512  -Opaque $true  -Fit Contain -Scale 0.86; Save-Icon $c[0] $c[1] 'splash-icon.png'
  } else {
    $c = New-Icon -Size 1024 -Opaque $true  -Fit Contain -Scale 0.80; Save-Icon $c[0] $c[1] 'icon.png'
    $c = New-Icon -Size 1024 -Opaque $true  -Fit Contain -Scale 0.80; Save-Icon $c[0] $c[1] 'adaptive-icon.png'
    # Zone sure : Android ne conserve que le cercle central.
    $c = New-Icon -Size 1024 -Opaque $false -Fit Contain -Scale 0.62; Save-Icon $c[0] $c[1] 'foreground.png'
    $c = New-Icon -Size 512  -Opaque $false -Fit Contain -Scale 0.78; Save-Icon $c[0] $c[1] 'splash-icon.png'
  }
}
finally {
  $logo.Dispose()
}

Write-Host ''
if ($resolvedMode -eq 'Image' -and $w -lt 1024) {
  Write-Warning "Source en ${w}x${h} : elle est agrandie pour l'icone 1024 et paraitra legerement floue. Un PNG 1024x1024 serait net."
}
Write-Host 'Termine. Relancez "npm run build:preview".'
