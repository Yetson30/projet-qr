# Code retiré — Sauvegarde de réutilisation
> Éléments supprimés de `index.html` car inutilisés.
> Conserver ici pour réintégration éventuelle.

---

## 1. Variables CSS inutilisées
> Définies dans `:root` mais jamais appelées avec `var()`.

```css
/* Ligne 19 — dans :root{} */
--wh:#fff;
--bk:#0d0d0d;
```

---

## 2. Classes boutons inutilisées
> Définies dans le CSS mais aucune occurrence dans le HTML.

```css
/* Ligne 33 — Bouton fond blanc */
.bwh{background:#fff;color:var(--or);}
.bwh:hover{background:#f5f5f5;}

/* Ligne 34 — Bouton outline translucide */
.bol{background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.3);}
.bol:hover{background:rgba(255,255,255,.25);}

/* Ligne 39-40 — Petit bouton langue */
.lbtn{padding:4px 9px;border-radius:5px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;font-size:11px;font-weight:700;cursor:pointer;}
.lbtn.on{background:#fff;color:var(--or);}

/* Ligne 67 — Liste batch */
.bl{max-height:150px;overflow-y:auto;margin-top:5px;}

/* Ligne 68 — Item batch container */
.bi{display:flex;align-items:center;justify-content:space-between;padding:5px 7px;background:var(--dk);border-radius:5px;margin-bottom:3px;border:1px solid #1e293b;}
```

---

## 3. Toolbar complète inutilisée
> Classes CSS + toolbar absente du HTML. Prévoir si on veut ajouter une barre d'outils zoom/édition.

```css
/* Lignes 82-88 */
.ctb{background:var(--sb);border-bottom:1px solid var(--brd);padding:6px 12px;display:flex;align-items:center;gap:6px;flex-shrink:0;flex-wrap:wrap;}
.tg{display:flex;align-items:center;gap:3px;padding-right:8px;border-right:1px solid var(--brd);}
.tg:last-child{border:none;}
.tbtn{width:28px;height:28px;border-radius:5px;border:none;background:rgba(255,255,255,.05);color:#94a3b8;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.tbtn:hover{background:rgba(236,102,8,.2);color:var(--or);}
.tbtn.on{background:rgba(236,102,8,.3);color:var(--or);}
.zv{color:#94a3b8;font-size:11px;font-weight:600;min-width:36px;text-align:center;}
```

**HTML toolbar correspondant (à recréer si besoin) :**
```html
<div class="ctb">
  <div class="tg">
    <button class="tbtn" onclick="doZoom(-0.1)"><i class="fas fa-minus"></i></button>
    <span class="zv" id="zoomVal">100%</span>
    <button class="tbtn" onclick="doZoom(0.1)"><i class="fas fa-plus"></i></button>
  </div>
</div>
```

---

## 4. Drapeaux CEMAC en CSS pur
> 6 classes CSS qui dessinent les drapeaux en dégradé.
> Non utilisées car remplacées par l'image `drapeaux_pays-removebg-preview.png`.
> **Utile si on veut revenir aux drapeaux CSS sans image.**

```css
/* Lignes 225-285 */

/* Gabon : bandes horizontales vert / jaune / bleu */
.fi-ga{
  background: linear-gradient(to bottom,
    #009E60 0 33.33%,
    #FCD116 33.33% 66.66%,
    #3A75C4 66.66% 100%);
}

/* Cameroun : bandes verticales vert / rouge / jaune */
.fi-cm{
  background: linear-gradient(to right,
    #007A5E 0 33.33%,
    #CE1126 33.33% 66.66%,
    #FCD116 66.66% 100%);
}

/* Guinée Équatoriale : vert / blanc / rouge + triangle bleu */
.fi-gq{
  background:
    linear-gradient(to bottom,
      #3E9A00 0 33.33%,
      #FFFFFF 33.33% 66.66%,
      #E32118 66.66% 100%),
    linear-gradient(135deg,
      #0073CE 0 50%,
      transparent 50% 100%);
  background-repeat:no-repeat;
  background-size:100% 100%, 50% 100%;
  background-position:0 0, 0 0;
}

/* Congo : diagonale verte / jaune / rouge */
.fi-cg{
  background: linear-gradient(135deg,
    #009A44 0 45%,
    #F7E017 45% 55%,
    #DC241F 55% 100%);
}

/* Centrafrique : bleu / blanc / vert / jaune + bande rouge */
.fi-cf{
  background:
    linear-gradient(to bottom,
      #003082 0 25%,
      #FFFFFF 25% 50%,
      #289728 50% 75%,
      #FFCB00 75% 100%),
    linear-gradient(to right,
      transparent 0 40%,
      #BC0026 40% 60%,
      transparent 60% 100%);
  background-repeat:no-repeat;
  background-size:100% 100%, 100% 100%;
}

/* Tchad : bleu / jaune / rouge vertical */
.fi-td{
  background: linear-gradient(to right,
    #002664 0 33.33%,
    #FECB00 33.33% 66.66%,
    #C60C30 66.66% 100%);
}
```

**HTML correspondant (utiliser à la place de l'image) :**
```html
<div class="p-flags">
  <div class="fi fi-ga"></div>
  <div class="fi fi-cm"></div>
  <div class="fi fi-gq"></div>
  <div class="fi fi-cg"></div>
  <div class="fi fi-cf"></div>
  <div class="fi fi-td"></div>
</div>
```

---

## 5. Panneau Propriétés droite (aside.rp) — entier
> Toujours `display:none`, jamais affiché. Panneau d'édition avancé complet.
> **Utile si on veut réactiver l'édition inline des éléments de l'affiche.**

### CSS associé à récupérer (chercher dans index.html) :
Classes liées : `.rp`, `.rph`, `.rpb`, `.rpe`, `.pbadge`, `.prw`, `.prsep`, `.prrow`, `.prFsRow`

### HTML complet :
```html
<!-- ══════════════ PANNEAU DROITE ══════════════ -->
<aside class="rp" style="display:none;">
  <div class="rph">
    <h3 id="rpTitle">✏️ Propriétés</h3>
  </div>
  <div class="rpb" id="rpBody">

    <div id="rpEmpty" class="rpe">
      <i class="fas fa-mouse-pointer"></i>
      Activez le mode <strong style="color:var(--or);">Édition</strong><br>
      puis cliquez sur un<br>élément de l'affiche
    </div>

    <div id="rpProps" style="display:none;">
      <div class="pbadge" id="rpBadge">—</div>

      <!-- Texte -->
      <div class="prw" id="prTxtRow">
        <label>Texte</label>
        <input type="text" id="prTxt" oninput="applyProp('text',this.value)" placeholder="Contenu…">
      </div>

      <!-- Police -->
      <div class="prw" id="prFsRow">
        <label>Taille police (px)</label>
        <input type="number" id="prFs" min="6" max="200" oninput="applyProp('fontSize',this.value+'px')">
      </div>

      <!-- Couleur texte -->
      <div class="prw" id="prColRow">
        <label>Couleur</label>
        <input type="color" id="prCol" oninput="applyProp('color',this.value)">
      </div>

      <!-- Alignement -->
      <div class="prw" id="prAlnRow">
        <label>Alignement</label>
        <select id="prAln" onchange="applyProp('textAlign',this.value)">
          <option value="left">◀ Gauche</option>
          <option value="center" selected>■ Centre</option>
          <option value="right">▶ Droite</option>
        </select>
      </div>

      <!-- Gras / Italique -->
      <div class="prw" id="prStyleRow">
        <label>Style</label>
        <div style="display:flex;gap:4px;">
          <button class="btn bgy" id="prBold" onclick="toggleBold()" style="flex:1;justify-content:center;font-size:12px;padding:5px;"><b>G</b></button>
          <button class="btn bgy" id="prItalic" onclick="toggleItalic()" style="flex:1;justify-content:center;font-size:12px;padding:5px;font-style:italic;">I</button>
        </div>
      </div>

      <div class="prsep"></div>

      <!-- Image : remplacer -->
      <div class="prw" id="prImgRow" style="display:none;">
        <label>Remplacer l'image</label>
        <div class="uz" style="padding:10px;">
          <input type="file" id="prImgFile" accept="image/*,.pdf" onchange="replaceImage(event)">
          <div class="uz-ic" style="font-size:16px;">🖼️</div>
          <div class="uz-tx" style="font-size:10.5px;">Cliquer pour choisir</div>
          <div class="uz-sx">PNG · JPG · PDF</div>
        </div>
      </div>

      <div class="prsep"></div>

      <!-- Position -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <div class="prw">
          <label>Position X</label>
          <input type="number" id="prX" oninput="applyPos('x',+this.value)">
        </div>
        <div class="prw">
          <label>Position Y</label>
          <input type="number" id="prY" oninput="applyPos('y',+this.value)">
        </div>
      </div>

      <!-- Taille -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <div class="prw">
          <label>Largeur</label>
          <input type="number" id="prW" oninput="applySize('w',+this.value)">
        </div>
        <div class="prw">
          <label>Hauteur</label>
          <input type="number" id="prH" oninput="applySize('h',+this.value)">
        </div>
      </div>

      <!-- Opacité -->
      <div class="prw">
        <label>Opacité — <span id="prOpV">100%</span></label>
        <input type="range" id="prOp" min="0" max="1" step="0.05" value="1"
               oninput="applyProp('opacity',+this.value);prOpV.textContent=Math.round(this.value*100)+'%'">
      </div>

      <div class="prsep"></div>

      <div class="prrow">
        <button class="btn bgy" onclick="dupEl()" style="flex:1;justify-content:center;font-size:10px;"><i class="fas fa-copy"></i> Dupliquer</button>
        <button class="btn bred" onclick="hideEl()" style="flex:1;justify-content:center;font-size:10px;"><i class="fas fa-eye-slash"></i> Masquer</button>
      </div>
      <div class="prrow" style="margin-top:4px;">
        <button class="btn bgy" onclick="resetEl()" style="width:100%;justify-content:center;font-size:10px;"><i class="fas fa-undo"></i> Réinitialiser cet élément</button>
      </div>
    </div>

  </div>
</aside>
```

---

## 6. Fonction JavaScript inutilisée
> `setLang()` pour basculer FR/EN. Les boutons `#bFR` et `#bEN` n'existent pas dans le HTML.
> **Utile si on veut ajouter un sélecteur de langue.**

```javascript
// Ligne 1334
function setLang(l){
  document.getElementById('bFR').classList.toggle('on',l==='fr');
  document.getElementById('bEN').classList.toggle('on',l==='en');
}
```

**HTML boutons à ajouter dans .hactions pour réactiver :**
```html
<button class="lbtn" id="bFR" onclick="setLang('fr')" class="on">FR</button>
<button class="lbtn" id="bEN" onclick="setLang('en')">EN</button>
```
