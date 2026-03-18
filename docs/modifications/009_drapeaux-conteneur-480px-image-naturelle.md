# 009 — Drapeaux CEMAC — conteneur aligné QR, image taille naturelle

| Champ | Valeur |
|-------|--------|
| **ID** | 009 |
| **Date** | 2026-03-16 |
| **Fichier modifié** | `index.html` |
| **Statut** | ✅ Appliqué |

---

## Contexte

Le conteneur `.p-flags` est aligné sur la largeur du QR code (480px),
mais l'image des drapeaux garde sa taille naturelle (263px) sans être étirée.

---

## Modifications CSS

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-flags` | `width` | `263px` | `480px` |
| `.p-flags img` | `width` | `263px` | `263px` *(inchangé)* |

---

## Comment revenir en arrière

Remettre `.p-flags` à `width:263px`.
