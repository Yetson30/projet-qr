# 📦 Guide de compilation — QR Poster Studio
## Générer le fichier `.exe` / `.msi` Windows

**Moov Money Gabon © 2026**

---

## 🎯 Résultat final

Après compilation tu obtiendras dans le dossier `electron/dist/` :

| Fichier | Description |
|---|---|
| `QR-Poster-Studio-Setup-1.0.0.exe` | **Installateur Windows** (double-clic pour installer) |
| `QR-Poster-Studio-Portable-1.0.0.exe` | **Version portable** (aucune installation requise) |

---

## 🖥️ Prérequis sur ton PC Windows

### 1. Node.js (obligatoire)
```
https://nodejs.org/en/download
→ Télécharger la version LTS (v20 ou v22)
→ Installer avec les options par défaut
→ Cocher "Add to PATH" si demandé
```

### 2. Vérifier l'installation
Ouvre **PowerShell** ou **Invite de commandes** et tape :
```powershell
node --version    # doit afficher v18, v20 ou v22
npm --version     # doit afficher 9 ou 10
```

### 3. Visual Studio Build Tools (pour modules natifs)
```
https://visualstudio.microsoft.com/visual-cpp-build-tools/
→ Installer "Outils de build C++"
→ Sélectionner "Développement Desktop en C++"
```
> ⚠️ Si tu n'as pas ceci, electron-builder peut échouer sur certains modules natifs.

---

## 🚀 Étapes de compilation

### Étape 1 — Télécharger le projet

Télécharge et décompresse le projet dans un dossier, par exemple :
```
C:\Projets\qr-poster-studio\
```

La structure doit ressembler à :
```
C:\Projets\qr-poster-studio\
  ├── electron\
  │   ├── main.js
  │   ├── preload.js
  │   ├── package.json
  │   └── build\
  │       ├── icon.ico        ← à créer (voir section Icône)
  │       └── license.txt
  ├── template-preview.html
  ├── assets\
  │   ├── logo-gimacpay.png
  │   ├── flag-ga.svg
  │   └── ...
  └── README.md
```

---

### Étape 2 — Créer l'icône (obligatoire)

L'installateur a besoin d'un fichier `icon.ico` de **256×256 px** minimum.

**Option A — Convertir en ligne :**
1. Va sur https://convertio.co/png-ico/
2. Uploade le logo Moov Money PNG
3. Télécharge le `.ico` résultant
4. Place-le dans `electron/build/icon.ico`

**Option B — PowerShell (si tu as Inkscape installé) :**
```powershell
inkscape assets\logo-moov-money.png --export-ico=electron\build\icon.ico -w 256
```

---

### Étape 3 — Installer les dépendances

Ouvre **PowerShell** dans le dossier `electron\` :
```powershell
cd C:\Projets\qr-poster-studio\electron
npm install
```
> ⏳ Première exécution : peut prendre 2–5 minutes (télécharge Electron ~120 MB)

---

### Étape 4 — Tester avant de compiler

Lance l'app en mode développement pour vérifier que tout fonctionne :
```powershell
npm start
```
✅ Une fenêtre doit s'ouvrir avec le QR Poster Studio.

---

### Étape 5 — Compiler l'installateur

```powershell
# Compilateur 64 bits (recommandé pour Windows 10/11)
npm run build:win

# Ou 32 + 64 bits (compatible avec les vieux PC)
npm run build:all
```

> ⏳ La compilation prend environ **3–8 minutes** selon ta connexion.

---

### Étape 6 — Récupérer les fichiers

Les fichiers générés se trouvent dans :
```
C:\Projets\qr-poster-studio\electron\dist\
  ├── QR-Poster-Studio Setup 1.0.0.exe     ← INSTALLATEUR
  ├── QR-Poster-Studio-Portable-1.0.0.exe  ← VERSION PORTABLE
  └── win-unpacked\                          ← dossier app non compressée
```

---

## 🔧 Commandes disponibles

| Commande | Action |
|---|---|
| `npm start` | Lancer en mode développement |
| `npm run build:win` | Compiler installateur 64 bits |
| `npm run build:win32` | Compiler installateur 32 bits |
| `npm run build:all` | Compiler 32 + 64 bits |
| `npm run pack` | Créer l'app sans installateur (test rapide) |

---

## 📋 Fonctionnalités de l'app Windows

| Fonctionnalité | Disponible |
|---|---|
| 🖥️ Fonctionne 100% offline | ✅ |
| 📂 Importer CSV (menu Fichier) | ✅ |
| 📥 Importer QR PDF/PNG | ✅ |
| 💾 Sauvegarder PNG 300 DPI | ✅ |
| 🖨️ Exporter PDF A4/A5 | ✅ |
| 📁 Dossier Exports automatique | ✅ Documents\QR Poster Studio\Exports |
| ⌨️ Raccourcis clavier | ✅ Ctrl+N, Ctrl+O, Ctrl+S, Ctrl+P… |
| 🔍 Zoom avant/arrière | ✅ Ctrl+= / Ctrl+- |
| 🖱️ Édition WYSIWYG | ✅ Clic, déplacement, redimensionnement |
| 🔄 Mise à jour manuelle | ✅ Remplacer l'installateur |

---

## ❓ Problèmes fréquents

### ❌ `electron-builder` introuvable
```powershell
npm install -g electron-builder
npm run build:win
```

### ❌ Erreur ENOENT `icon.ico`
Créer le fichier `electron/build/icon.ico` (voir Étape 2).

### ❌ Erreur `EPERM` ou permissions refusées
Lancer PowerShell **en tant qu'administrateur**.

### ❌ `node-gyp` errors
```powershell
npm install -g windows-build-tools
```
Ou installer Visual Studio Build Tools (voir Prérequis étape 3).

### ❌ L'app s'ouvre mais la page est blanche
Vérifier que `template-preview.html` est bien à la racine du projet
(un niveau au-dessus du dossier `electron/`).

---

## 🔄 Mettre à jour l'application

Pour modifier le poster ou ajouter des fonctionnalités :

1. Modifie les fichiers HTML/CSS/JS dans le projet web
2. Retourne dans `electron/` et relance :
```powershell
npm run build:win
```
3. Distribue le nouveau `.exe` à l'équipe

---

## 📞 Support

**Moov Money Gabon — Département Marketing & Expérience Client**
📧 contact@moovmoney.ga
🌐 www.moovmoney.ga

---

*QR Poster Studio v1.0.0 — Compilé avec Electron v29 + electron-builder v24*
