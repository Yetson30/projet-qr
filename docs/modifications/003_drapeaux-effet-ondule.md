# 003 — Drapeaux CEMAC — Effet ondulé (wavy flags)

| Champ | Valeur |
|-------|--------|
| **ID** | 003 |
| **Date** | 2026-03-12 |
| **Fichiers modifiés** | `assets/flag-ga.svg`, `flag-cm.svg`, `flag-gq.svg`, `flag-cg.svg`, `flag-cf.svg`, `flag-td.svg`, `index.html` |
| **Source** | Charte graphique (`image.png`) — drapeaux ondulés |
| **Statut** | ✅ Appliqué |

---

## Contexte

Les drapeaux apparaissaient comme de simples rectangles plats.
La charte graphique montre des drapeaux avec un effet tissu ondulé.
L'ondulation est intégrée **directement dans chaque fichier SVG** via un `<clipPath>`
interne — la forme ondulée est appliquée à tout le contenu du drapeau.

---

## Technique — clipPath SVG interne

### Chemin d'ondulation (identique pour les 6 drapeaux)

```svg
<clipPath id="wave">
  <path d="M0,100 C150,0 300,200 450,100 C600,0 750,200 900,100
           L900,500
           C750,600 600,400 450,500 C300,600 150,400 0,500 Z"/>
</clipPath>
```

**Lecture du chemin (viewBox 900×600) :**
- Bord haut : 2 vagues cubiques — amplitude ±100px (17% de 600px)
- Bord droit : ligne droite `y=100 → y=500`
- Bord bas : 2 vagues symétriques inversées
- Amplitude à l'affichage (36px hauteur) : `100/600 × 36 ≈ 6px` — visible et naturel

### Structure de chaque SVG modifié

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
  <defs>
    <clipPath id="wave">
      <path d="M0,100 C150,0 300,200 450,100 C600,0 750,200 900,100
               L900,500 C750,600 600,400 450,500 C300,600 150,400 0,500 Z"/>
    </clipPath>
  </defs>
  <g clip-path="url(#wave)">
    <!-- contenu du drapeau inchangé -->
  </g>
</svg>
```

---

## Modifications CSS (`index.html`)

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-flags` | `gap` | `2px` | `3px` |
| `.p-flags` | `height` | `32px` | `36px` |
| `.p-flags` | `overflow` | `visible` | `visible` |
| `.p-flags img` *(nouveau)* | `height` | `30px` (inline) | `36px` (CSS) |
| `.fi` + `clip-path` CSS | *(supprimés)* | `clip-path:url(#waveFlag)` | *(supprimé)* |

SVG inline `#waveFlag` supprimé du HTML (remplacé par les clipPath dans les SVG).

---

## Modifications HTML (`index.html`)

Retour aux balises `<img>` SVG (les SVG portent maintenant leur propre ondulation) :

```html
<img src="assets/flag-ga.svg" alt="Gabon">
<img src="assets/flag-cm.svg" alt="Cameroun">
<img src="assets/flag-gq.svg" alt="Guinée Équatoriale">
<img src="assets/flag-cg.svg" alt="Congo">
<img src="assets/flag-cf.svg" alt="Centrafrique">
<img src="assets/flag-td.svg" alt="Tchad">
```

---

## Comment revenir en arrière

### SVG (retirer l'ondulation de chaque fichier)

Supprimer le bloc `<defs>...</defs>` et retirer `clip-path="url(#wave)"` du `<g>` dans chacun des 6 fichiers SVG.

### HTML / CSS

Restaurer dans `.p-flags` : `gap:0`, `height:30px`
Remettre les styles inline `height:30px;width:auto;margin-right:2px` sur chaque `<img>`.
