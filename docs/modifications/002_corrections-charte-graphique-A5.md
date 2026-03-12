# 002 — Corrections selon la Charte Graphique A5

| Champ | Valeur |
|-------|--------|
| **ID** | 002 |
| **Date** | 2026-03-12 |
| **Fichier modifié** | `index.html` |
| **Sources** | `Charte grafique/Details poster.txt` + `Charte grafique/image.png` |
| **Statut** | ✅ Appliqué |

---

## Contexte

Après le passage A4→A5 (fiche 001), les tailles de police avaient été mal calculées
(ratio ×0.704 appliqué mécaniquement). La charte graphique donne les vraies valeurs
pour A5. L'image révèle aussi un élément manquant : le titre "SCANNEZ & PAYEZ".

---

## Corrections CSS (`index.html` — balise `<style>`)

### Zone haute

| Sélecteur | Propriété | Avant | Après | Source |
|-----------|-----------|-------|-------|--------|
| `.p-top` | `height` | `123px` | `106px` | Image (28mm × 3.778px/mm) |

### Carte blanche

| Sélecteur | Propriété | Avant | Après | Source |
|-----------|-----------|-------|-------|--------|
| `.p-card` | `left` | `44px` | `18px` | Txt (4,75mm × 3.778) |
| `.p-card` | `top` | `123px` | `106px` | Image (28mm) |
| `.p-card` | `width` | `471px` | `523px` | Txt (559 − 2×18px) |
| `.p-card` | `height` | `581px` | `598px` | Recalculé (794−106−90) |
| `.p-name` | `margin-bottom` | `4px` | `11px` | Txt (3mm = 11.3px) |

### Nouveau élément `.p-title`

```css
.p-title {
  font-family: 'Century Gothic', Arial, sans-serif;
  font-size: 28pt; font-weight: 900;
  color: #000; text-align: center; text-transform: uppercase;
  letter-spacing: 1px; line-height: 1.1;
  width: 100%; margin-bottom: 15px;
  cursor: move; padding: 2px; border-radius: 3px;
}
```
> Source : txt (28pt) + image (élément visible au-dessus du nom marchand)

### QR Code & Drapeaux

| Sélecteur | Propriété | Avant | Après | Source |
|-----------|-----------|-------|-------|--------|
| `.p-qr` | `width` | `268px` | `244px` | Image (64,5mm × 3.778) |
| `.p-qr` | `height` | `268px` | `244px` | Image (64,5mm × 3.778) |
| `.p-qr` | `margin-bottom` | `10px` | `9px` | Txt (2,5mm = 9.4px) |
| `.p-flags` | `width` | `268px` | `244px` | Aligné avec QR |
| `.p-flags` | `margin-bottom` | `6px` | `9px` | Txt (2,5mm QR→flags) |
| `.p-gimacpay` | `margin` (bottom) | `5px` | `19px` | Txt (5mm = 18.9px) |

---

## Corrections HTML (`index.html` — balisage)

### Nouvel élément ajouté

```html
<!-- Titre SCANNEZ & PAYEZ -->
<div class="p-title editable" id="elTitle"
     data-label="Titre SCANNEZ & PAYEZ" data-type="text">
  SCANNEZ &amp; PAYEZ
</div>
```
> Inséré **avant** `#elName` dans `.p-card`

### Polices corrigées (valeurs directes de la charte, sans ratio)

| Élément | Propriété | Avant | Après | Source |
|---------|-----------|-------|-------|--------|
| `#elName` | `font-size` (inline) | `17pt` | `24pt` | Txt "Nom du Marchand: 24pt" |
| `#elCodeLbl` | `font-size` (inline) | `20pt` | `14pt` | Label, non spécifié dans txt |
| `#elCodeLbl` | `margin-top` (inline) | `2mm` | *(supprimé)* | Géré par `.p-name` margin |
| `#elVos` | `font-size` (inline) | `8.5pt` | `12pt` | Txt "VOS PAIEMENTS: 12pt" |
| `#qrCanvas` | `width`/`height` (attr) | `260` | `244` | Aligné avec `.p-qr` |

### Drapeaux

| Élément | Attribut | Avant | Après |
|---------|----------|-------|-------|
| `#elFlags` | `margin-bottom` (inline) | `5mm` | `5mm` *(inchangé ✓)* |
| Flags `<img>` | `height` (inline) | `30px` | `30px` *(inchangé ✓)* |

---

## Comment revenir en arrière (revert)

### Option rapide — Git

```bash
# Revenir à l'état juste avant les corrections charte (= après fiche 001)
git stash   # si les changements ne sont pas commités

# OU si commité :
git checkout <hash-avant-002> -- index.html
```

### Option manuelle

Inverser les valeurs **Après → Avant** dans les tableaux ci-dessus.
Pour supprimer `elTitle`, retirer le bloc HTML :
```html
<!-- Titre SCANNEZ & PAYEZ -->
<div class="p-title editable" id="elTitle" ...>SCANNEZ &amp; PAYEZ</div>
```
Et retirer le CSS `.p-title { ... }` de la balise `<style>`.
