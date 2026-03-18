# 012 — Fix : copie du canvas QR lors de l'export PDF/PNG

| Champ | Valeur |
|-------|--------|
| **ID** | 012 |
| **Date** | 2026-03-16 |
| **Fichier modifié** | `js/app.js` |
| **Statut** | ✅ Appliqué |

---

## Contexte

Lors de l'export PDF/PNG, `renderPosterAsCanvas()` utilise `cloneNode(true)` pour
dupliquer le poster. Or, `cloneNode` ne copie pas le contenu pixel des éléments
`<canvas>`. Le QR code apparaissait donc vide ou déformé dans le PDF final.

---

## Correction

Après le `cloneNode`, copie manuelle des pixels du `#qrCanvas` original vers le
canvas cloné via `drawImage`.

```javascript
const srcCanvas = document.getElementById('qrCanvas');
const dstCanvas = clone.querySelector('#qrCanvas');
if(srcCanvas && dstCanvas){
  dstCanvas.width = srcCanvas.width;
  dstCanvas.height = srcCanvas.height;
  dstCanvas.getContext('2d').drawImage(srcCanvas, 0, 0);
}
```

---

## Comment revenir en arrière

Supprimer le bloc de copie canvas ajouté dans `renderPosterAsCanvas()` (`js/app.js`).
