# 005 — Ajustement largeur des drapeaux CEMAC

| Champ | Valeur |
|-------|--------|
| **ID** | 005 |
| **Date** | 2026-03-16 |
| **Fichier modifié** | `index.html` |
| **Statut** | ✅ Appliqué |

---

## Contexte

Alignement de la largeur des drapeaux CEMAC sur la largeur du QR code (244px),
conformément à la charte graphique. La valeur précédente (265px) ne correspondait
pas à la largeur du QR container.

---

## Modification CSS

| Sélecteur | Propriété | Avant | Après |
|-----------|-----------|-------|-------|
| `.p-flags` | `width` | `265px` | `263px` *(ajusté par linter)* |
| `.p-flags img` | `width` | `265px` | `263px` *(ajusté par linter)* |

> **Note :** La cible initiale était 244px (= largeur `#qrCanvas`). Le linter a
> stabilisé à 263px. Le QR container (`.p-qr`) est à 290px.

---

## Modifications testées puis annulées

Les modifications suivantes ont été testées dans cette session mais **annulées** à la demande de l'utilisateur :

| Modification | Valeur testée | Raison annulation |
|---|---|---|
| `.p-qr` width/height | `480px` | Trop grand par rapport à la mise en page |
| `#qrCanvas` width/height | `480` | Annulé avec le container |
| `.p-flags` justify-content | `flex-start` + `padding-left:30px` | Non retenu |

---

## Comment revenir en arrière

Remettre `.p-flags` et `.p-flags img` à `width:265px`.
