# 004 — Drapeaux CEMAC — Remplacement par image unique

| Champ | Valeur |
|-------|--------|
| **ID** | 004 |
| **Date** | 2026-03-12 |
| **Fichier modifié** | `index.html` |
| **Statut** | ✅ Appliqué |

---

## Contexte

Remplacement des 6 fichiers SVG individuels par une seule image PNG
`drapeaux_pays-removebg-preview.png` qui contient déjà les 6 drapeaux
ondulés avec fond transparent (emoji-style waving flags).

---

## Modification HTML

### Avant
```html
<img src="assets/flag-ga.svg" alt="Gabon">
<img src="assets/flag-cm.svg" alt="Cameroun">
<img src="assets/flag-gq.svg" alt="Guinée Équatoriale">
<img src="assets/flag-cg.svg" alt="Congo">
<img src="assets/flag-cf.svg" alt="Centrafrique">
<img src="assets/flag-td.svg" alt="Tchad">
```

### Après
```html
<img src="assets/drapeaux_pays-removebg-preview.png" alt="Drapeaux CEMAC">
```

## Modification CSS

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-flags` | `gap` | `3px` | *(supprimé)* |
| `.p-flags` | `height` | `36px` | `auto` |
| `.p-flags img` | `width` | `auto` | `244px` |
| `.p-flags img` | `height` | `36px` | `auto` |

---

## Comment revenir en arrière

Remettre les 6 balises `<img>` individuelles (voir fiche 003) et
restaurer le CSS `.p-flags` avec `gap:3px` et `height:36px`.
