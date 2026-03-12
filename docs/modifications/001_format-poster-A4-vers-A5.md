# 001 — Passage du format poster A4 → A5

| Champ | Valeur |
|-------|--------|
| **ID** | 001 |
| **Date** | 2026-03-12 |
| **Fichier modifié** | `index.html` |
| **Demande** | Le poster doit être au format A5 (148×210 mm) |
| **Statut** | ✅ Appliqué |

---

## Contexte

Le poster était dimensionné en A4 (794×1123 px à 96 dpi).
Passage en A5 (559×794 px) avec redimensionnement proportionnel de tous les
éléments internes (ratio **×0.704**).

---

## Modifications CSS (`index.html` — balise `<style>`)

### Poster principal

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| Commentaire | — | `AFFICHE A4 — 794 × 1123 px` | `AFFICHE A5 — 559 × 794 px` |
| `.poster` | `width` | `794px` | `559px` |
| `.poster` | `height` | `1123px` | `794px` |

### Zone haute (orange)

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-top` | `height` | `175px` | `123px` |
| `.p-logo` | `width` | `110px` | `77px` |
| `.p-logo` | `height` | `110px` | `77px` |
| `.p-url` | `font-size` | `22px` | `15px` |

### Carte blanche centrale

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-card` | `left` | `63px` | `44px` |
| `.p-card` | `top` | `175px` | `123px` |
| `.p-card` | `width` | `668px` | `471px` |
| `.p-card` | `height` | `820px` | `581px` |
| `.p-card` | `border-radius` | `20px` | `14px` |
| `.p-card` | `padding` | `16px 32px 12px` | `11px 22px 8px` |
| `.p-name` | `font-size` | `40px` | `28px` |
| `.p-codelabel` | `font-size` | `24px` | `17px` |
| `.p-qr` | `width` | `380px` | `268px` |
| `.p-qr` | `height` | `380px` | `268px` |
| `.p-qr` | `border` | `6px solid #000` | `4px solid #000` |
| `.p-qr` | `border-radius` | `4px` | `3px` |
| `.p-flags` | `width` | `380px` | `268px` |
| `.p-flags` | `height` | `42px` | `30px` |
| `.p-flags` | `margin-bottom` | `9px` | `6px` |
| `.p-gimacpay` | `width` | `277px` | `195px` |
| `.p-gimacpay` | `height` | `98px` | `69px` |
| `.p-gimacpay` | `margin` | `-8px auto 7px auto` | `-6px auto 5px auto` |
| `.p-gimacpay img` | `width` | `277px` | `195px` |
| `.p-gimacpay img` | `height` | `98px` | `69px` |
| `.p-vos` | `font-size` | `18px` | `13px` |

### Zone basse (orange)

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-bot` | `height` | `128px` | `90px` |
| `.p-bot` | `padding` | `0 36px` | `0 25px` |
| `.p-cap` | `width` | `190px` | `134px` |
| `.p-cap` | `height` | `78px` | `55px` |
| `.p-cap` | `padding` | `8px 16px` | `6px 11px` |
| `.p-cap img` | `max-height` | `58px` | `41px` |
| `.p-cap img` | `max-width` | `158px` | `111px` |
| `.p-cap-txt` | `font-size` | `13px` | `9px` |

### Impression

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `@media print .poster` | `width` | `210mm` | `148mm` |
| `@media print .poster` | `height` | `297mm` | `210mm` |

---

## Modifications HTML (`index.html` — balisage)

| Élément | Attribut / style | Avant | Après |
|---------|------------------|-------|-------|
| Commentaire HTML | — | `AFFICHE A4 — 794 × 1123 px` | `AFFICHE A5 — 559 × 794 px` |
| `#elName` | `font-size` (inline) | `24pt` | `17pt` |
| `#elCodeLbl` | `font-size` (inline) | `28pt` | `20pt` |
| `#elCodeLbl` | `margin-top` (inline) | `3mm` | `2mm` |
| `#qrCanvas` | `width` (attr) | `368` | `260` |
| `#qrCanvas` | `height` (attr) | `368` | `260` |
| Drapeaux commentaire | — | `380×42px` / `63.3×42 px` | `268×30px` / `44.7×30 px` |
| `#elFlags` | `margin-bottom` (inline) | `7mm` | `5mm` |
| Flags `<img>` | `height` (inline) | `42px` | `30px` |
| GIMACPAY `<img>` | `width` (inline) | `277px` | `195px` |
| GIMACPAY `<img>` | `height` (inline) | `98px` | `69px` |
| `#elVos` | `font-size` (inline) | `12pt` | `8.5pt` |
| `#elVos` | `margin-bottom` (inline) | `12.25mm` | `9mm` |
| `#elVos` | `margin-top` (inline) | `7mm` | `5mm` |
| `#stInf` | texte | `A4 · 794×1123 px · Mode Édition` | `A5 · 559×794 px · Mode Édition` |
| `#eFmt` select | ordre / défaut | A4 en premier | A5 en premier (`selected`) |

---

## Modifications JavaScript (`index.html` — balise `<script>`)

| Fonction | Ligne / contexte | Avant | Après |
|----------|-----------------|-------|-------|
| `zoomFit()` | calcul zoom X | `/794` | `/559` |
| `zoomFit()` | calcul zoom Y | `/1123` | `/794` |
| `applyZ()` | `marginBottom` | `1123*(Z-1)` | `794*(Z-1)` |
| `toggleEdit()` | texte statut édition | `'A4 · Mode Édition actif'` | `'A5 · Mode Édition actif'` |
| `toggleEdit()` | texte statut aperçu | `'A4 · Mode Aperçu'` | `'A5 · Mode Aperçu'` |

---

## Comment revenir en arrière (revert)

### Option rapide — Git

```bash
# Revenir exactement à l'état avant cette modification
git checkout 5a2ab27 -- index.html
```

> Le commit `5a2ab27` est le dernier état avant le passage A5.

### Option manuelle

Remplacer chaque valeur **Après** par la valeur **Avant** dans les tableaux ci-dessus.
Les lignes à modifier dans `index.html` se retrouvent facilement avec ces recherches :

```
559×794        → remettre 794×1123
width:559px    → width:794px
height:794px   → height:1123px
```
