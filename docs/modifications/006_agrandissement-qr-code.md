# 006 — Agrandissement zone QR code

| Champ | Valeur |
|-------|--------|
| **ID** | 006 |
| **Date** | 2026-03-16 |
| **Fichier modifié** | `index.html` |
| **Statut** | ✅ Appliqué |

---

## Contexte

Le QR code (290px) était plus petit que le logo GIMACPAY (460px).
Agrandissement pour que le QR soit plus large et plus grand que le logo.

---

## Modifications CSS / HTML

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-qr` | `width` | `290px` | `480px` |
| `.p-qr` | `height` | `290px` | `480px` |
| `#qrCanvas` | `width` (attr) | `244` | `480` |
| `#qrCanvas` | `height` (attr) | `244` | `480` |

---

## Comment revenir en arrière

Remettre `.p-qr` à `width:290px;height:290px` et `#qrCanvas` à `width="244" height="244"`.
