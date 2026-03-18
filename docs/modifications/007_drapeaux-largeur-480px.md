# 007 — Drapeaux CEMAC — largeur alignée sur QR code (480px)

| Champ | Valeur |
|-------|--------|
| **ID** | 007 |
| **Date** | 2026-03-16 |
| **Fichier modifié** | `index.html` |
| **Statut** | ✅ Appliqué |

---

## Contexte

Alignement de la largeur des drapeaux CEMAC sur la nouvelle largeur du QR code (480px),
pour que les deux éléments soient sur la même largeur et plus larges que le logo GIMACPAY (460px).

---

## Modifications CSS

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-flags` | `width` | `263px` | `480px` |
| `.p-flags img` | `width` | `263px` | `480px` |

---

## Comment revenir en arrière

Remettre `.p-flags` et `.p-flags img` à `width:263px`.
