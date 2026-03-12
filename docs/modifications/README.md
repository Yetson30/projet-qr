# Journal des Modifications — QR Poster Studio

Ce dossier répertorie **toutes les modifications apportées** au projet.
Chaque fiche décrit : **ce qui a changé**, **pourquoi**, et **comment revenir en arrière**.

---

## Structure d'une fiche

```
NNN_nom-de-la-modification.md
```

| Champ | Description |
|-------|-------------|
| `ID` | Numéro séquentiel `001`, `002`… |
| `Date` | Date de la modification |
| `Fichier(s)` | Fichiers touchés |
| `Avant / Après` | Valeurs exactes changées |
| `Revert` | Commande git ou étapes manuelles pour annuler |

---

## Index des modifications

| ID | Date | Description | Fichier(s) | Statut |
|----|------|-------------|------------|--------|
| [001](./001_format-poster-A4-vers-A5.md) | 2026-03-12 | Passage du poster A4 → A5 | `index.html` | ✅ Appliqué |
| [002](./002_corrections-charte-graphique-A5.md) | 2026-03-12 | Corrections charte graphique A5 (polices, espacements, titre SCANNEZ & PAYEZ) | `index.html` | ✅ Appliqué |
| [003](./003_drapeaux-effet-ondule.md) | 2026-03-12 | Drapeaux CEMAC — effet ondulé via SVG clipPath Bézier | `assets/*.svg` + `index.html` | ✅ Appliqué |
| [004](./004_drapeaux-image-unique.md) | 2026-03-12 | Drapeaux CEMAC — remplacement par image unique PNG ondulée | `index.html` | ✅ Appliqué |

---

## Comment revenir en arrière ?

### Option 1 — Via Git (recommandé)

```bash
# Voir les commits disponibles
git log --oneline

# Revenir à un commit précis (sans perdre les autres fichiers)
git checkout <commit-hash> -- index.html

# Exemple : revenir avant le passage A5
git checkout 5a2ab27 -- index.html
```

### Option 2 — Manuellement

Consulter la fiche de modification correspondante (colonne **Avant**),
et remettre chaque valeur dans `index.html`.

---

## Bonnes pratiques

- Toujours **commiter avant** une modification importante (`git commit -m "..."`)
- Une fiche par session de travail ou par thème
- Conserver les valeurs **Avant** exactes pour pouvoir faire un revert propre
