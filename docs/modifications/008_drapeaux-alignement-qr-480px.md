# 008 — Drapeaux CEMAC — alignement largeur avec QR code

| Champ | Valeur |
|-------|--------|
| **ID** | 008 |
| **Date** | 2026-03-16 |
| **Fichier modifié** | `index.html` |
| **Statut** | ✅ Appliqué |

---

## Contexte

Alignement de la largeur du conteneur des drapeaux CEMAC sur la largeur du QR code (480px).

---

## Modifications CSS

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-flags` | `width` | `263px` | `480px` |
| `.p-flags img` | `width` | `263px` | `480px` |

---

## Comment revenir en arrière

Remettre `.p-flags` et `.p-flags img` à `width:263px`.
