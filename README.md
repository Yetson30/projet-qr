# 🖨️ QR Poster Studio — Moov Money Gabon
**v2.3 — Mars 2026**

Générateur de posters marchands GIMACPAY / Moov Money pour la zone CEMAC.
Crée, personnalise et exporte des affiches QR code pour les points de vente.

---

## 🚀 Fichiers principaux

| Fichier | Description |
|---|---|
| `template-preview.html` | **Application principale** — ouvrir dans le navigateur |
| `index.html` | Page d'accueil |
| `electron/` | Scaffolding pour packaging Windows `.exe` |

---

## ✅ Fonctionnalités complétées

### Poster GIMACPAY
- ✅ Logo Moov Money blanc centré (zone orange)
- ✅ URL `moovmoney.ga` — texte blanc bold
- ✅ Nom marchand + code marchand (boîtes individuelles par caractère)
- ✅ QR code 380×380 px, bordure 8 px
- ✅ **6 drapeaux CEMAC** — Gabon, Cameroun, Guinée Équatoriale, Congo, Centrafrique, Tchad — 380×42 px, sans espaces
- ✅ Logo **GIMACPAY** officiel PNG (277×98 px, +30%)
- ✅ Logo maDIGI + Logo GIMAC (bas du poster)
- ✅ Texte "VOS PAIEMENTS MOBILES ACCEPTÉS ICI" — 18 px bold

### Édition WYSIWYG
- ✅ Clic pour sélectionner (cadre bleu)
- ✅ Glisser-déposer pour déplacer
- ✅ Panneau de propriétés (taille, couleur, position X/Y, opacité)
- ✅ Gras / italique / alignement
- ✅ Remplacement d'image
- ✅ Nudge au clavier (←→↑↓ = 2 px, Shift = 10 px)

### Import / Export
- ✅ Import QR code PDF (pdf.js v3.11.174 — chargement bloquant)
- ✅ Import QR code PNG/JPG
- ✅ Import CSV marchands (modal)
- ✅ Export PNG 300 DPI (html2canvas ×3)
- ✅ Export PDF A4/A5 300 DPI (jsPDF + html2canvas)
- ✅ Traitement batch (liste marchands, barre de progression)

---

## 📁 Structure des fichiers

```
├── template-preview.html     ← Application principale
├── index.html                ← Page d'accueil
├── assets/
│   ├── logo-gimacpay.png     ← Logo GIMACPAY officiel
│   ├── logo-gimac.png        ← Logo GIMAC
│   ├── logo-madigi.png       ← Logo maDIGI
│   ├── logo-moov-money.png   ← Logo Moov Money
│   ├── flag-ga.svg           ← 🇬🇦 Gabon
│   ├── flag-cm.svg           ← 🇨🇲 Cameroun
│   ├── flag-gq.svg           ← 🇬🇶 Guinée Équatoriale
│   ├── flag-cg.svg           ← 🇨🇬 Congo
│   ├── flag-cf.svg           ← 🇨🇫 Centrafrique
│   └── flag-td.svg           ← 🇹🇩 Tchad
├── electron/
│   ├── main.js               ← Processus principal Electron
│   ├── preload.js            ← Bridge sécurisé UI/Node.js
│   ├── package.json          ← Config + scripts build
│   ├── build/
│   │   ├── icon.ico          ← (à créer — voir README-BUILD.md)
│   │   └── license.txt       ← Licence CLUF
│   └── README-BUILD.md       ← Guide compilation .exe pas-à-pas
└── README.md                 ← Ce fichier
```

---

## 📦 Packaging Windows (.exe)

Voir **`electron/README-BUILD.md`** pour le guide complet.

### Résumé rapide
```powershell
cd electron
npm install
npm run build:win
# → dist/QR-Poster-Studio Setup 1.0.0.exe
```

**Prérequis :** Node.js v18+ LTS, Visual Studio Build Tools

---

## 🛠️ Stack technique

| Technologie | Version | Usage |
|---|---|---|
| HTML5 / CSS3 / JS vanilla | — | Interface |
| QRCode.js | v1.5.3 | Génération QR |
| pdf.js | v3.11.174 | Import QR PDF |
| html2canvas | v1.4.1 | Capture poster |
| jsPDF | v2.5.1 | Export PDF |
| Font Awesome | v6.4.0 | Icônes |
| Google Fonts Inter | — | Typographie |
| Electron | v29 | App Windows |
| electron-builder | v24 | Packaging .exe |

---

## 🔜 Prochaines étapes

- [ ] Icône `.ico` officielle Moov Money pour l'installateur
- [ ] Tableau de bord marchands (liste, stats, filtres)
- ✅ Génération batch automatisée depuis Excel/CSV
- [ ] Signature numérique du `.exe` (certificat code signing)
- [ ] Auto-update intégré

---

*Moov Money Gabon — Département Marketing & Expérience Client*
*© 2026 — Tous droits réservés*
