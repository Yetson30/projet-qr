// pdf.js n'est plus initialisé à l'avance — il est chargé à la demande
// dans importQRfromPDF() et importPDFasImage(), qui fixent aussi le worker.
// (La fonction initPDFjs et son appel étaient ici, mais ils sont désormais inutiles.)

// ═══════ STATE ═══════
let Z=0.75, editMode=true, selEl=null, batch=[], qrImported=false, currentBatchIndex=undefined;
const origStyles={}; // pour reset

// ═══════ ZOOM ═══════
function doZoom(d){ Z=Math.max(0.15,Math.min(2,Z+d)); applyZ(); }
function zoomFit(){
  const vp=document.getElementById('cvp');
  Z=Math.min((vp.clientWidth-60)/559,(vp.clientHeight-40)/794);
  applyZ();
}
function applyZ(){
  const pw=document.getElementById('pw');
  pw.style.transform=`scale(${Z})`;
  pw.style.transformOrigin='top center';
  pw.style.marginBottom=(794*(Z-1))+'px';
  const zvlEl = document.getElementById('zvl');
  if(zvlEl) zvlEl.textContent=Math.round(Z*100)+'%';
}

// ═══════ EDIT MODE ═══════
function toggleEdit(){
  editMode=!editMode;
  const btn=document.getElementById('btnEd');
  const edLbl=document.getElementById('edLbl');
  if(edLbl) edLbl.textContent=editMode?'Édition ON':'Aperçu';
  if(btn) btn.classList.toggle('on',editMode);
  document.querySelectorAll('.editable').forEach(el=>{
    el.style.cursor=editMode?'move':'default';
  });
  if(!editMode) deselectAll();
  const stInf=document.getElementById('stInf');
  if(stInf) stInf.textContent=editMode?'A5 · Mode Édition actif':'A5 · Mode Aperçu';
}

// ═══════ SELECTION ═══════
function selectEl(el){
  deselectAll();
  selEl=el;
  el.classList.add('sel');
  const selLabel = document.getElementById('selLabel');
  if(selLabel) selLabel.textContent='✏️ '+( el.dataset.label||el.id);
  showProps(el);
}
function deselectAll(){
  document.querySelectorAll('.editable.sel').forEach(e=>e.classList.remove('sel'));
  selEl=null;
  const selLabel = document.getElementById('selLabel');
  if(selLabel) selLabel.textContent='Aucun élément sélectionné';
  const rpEmpty = document.getElementById('rpEmpty');
  const rpProps = document.getElementById('rpProps');
  if(rpEmpty) rpEmpty.style.display='block';
  if(rpProps) rpProps.style.display='none';
}

// ═══════ PROPERTIES PANEL ═══════
function showProps(el){
  document.getElementById('rpEmpty').style.display='none';
  document.getElementById('rpProps').style.display='block';
  document.getElementById('rpBadge').textContent=el.dataset.label||el.id;
  const type=el.dataset.type;
  const isText=type==='text';
  const isImg=type==='image';
  // show/hide rows
  ['prTxtRow','prFsRow','prColRow','prAlnRow','prStyleRow'].forEach(id=>{
    document.getElementById(id).style.display=isText?'block':'none';
  });
  document.getElementById('prImgRow').style.display=isImg?'block':'none';
  if(isText){
    document.getElementById('prTxt').value=el.innerText.trim();
    const cs=getComputedStyle(el);
    document.getElementById('prFs').value=parseInt(cs.fontSize)||16;
    document.getElementById('prCol').value=rgb2hex(cs.color);
    document.getElementById('prAln').value=cs.textAlign||'center';
    document.getElementById('prBold').classList.toggle('bbl',cs.fontWeight>='700');
    document.getElementById('prItalic').classList.toggle('bbl',cs.fontStyle==='italic');
  }
  const r=el.getBoundingClientRect();
  const pr=document.getElementById('poster').getBoundingClientRect();
  document.getElementById('prX').value=Math.round((r.left-pr.left)/Z);
  document.getElementById('prY').value=Math.round((r.top-pr.top)/Z);
  document.getElementById('prW').value=Math.round(r.width/Z);
  document.getElementById('prH').value=Math.round(r.height/Z);
  document.getElementById('prOp').value=parseFloat(el.style.opacity)||1;
  document.getElementById('prOpV').textContent=Math.round((parseFloat(el.style.opacity)||1)*100)+'%';
  document.getElementById('rpTitle').textContent='✏️ '+(el.dataset.label||'Propriétés');
}

function applyProp(prop,val){
  if(!selEl)return;
  if(prop==='text'){
    selEl.innerText=val;
    if(selEl.id==='elCodeLbl') selEl.innerText=val;
  } else if(prop==='fontSize'){
    selEl.style.fontSize=val;
  } else if(prop==='color'){
    selEl.style.color=val;
  } else if(prop==='textAlign'){
    selEl.style.textAlign=val;
  } else if(prop==='opacity'){
    selEl.style.opacity=val;
    document.getElementById('prOpV').textContent=Math.round(val*100)+'%';
  }
}
function applyPos(axis,v){
  if(!selEl)return;
  const pr=document.getElementById('poster').getBoundingClientRect();
  const r=selEl.getBoundingClientRect();
  if(axis==='x'){
    const cur=(r.left-pr.left)/Z;
    selEl.style.marginLeft=(parseFloat(selEl.style.marginLeft||0)+(v-cur))+'px';
  } else {
    const cur=(r.top-pr.top)/Z;
    selEl.style.marginTop=(parseFloat(selEl.style.marginTop||0)+(v-cur))+'px';
  }
}
function applySize(axis,v){
  if(!selEl||v<=0)return;
  if(axis==='w') selEl.style.width=v+'px';
  else selEl.style.height=v+'px';
}
function toggleBold(){
  if(!selEl)return;
  const cs=getComputedStyle(selEl);
  const nb=cs.fontWeight>='700'?'normal':'900';
  selEl.style.fontWeight=nb;
  document.getElementById('prBold').classList.toggle('bbl',nb==='900');
}
function toggleItalic(){
  if(!selEl)return;
  const cs=getComputedStyle(selEl);
  const ni=cs.fontStyle==='italic'?'normal':'italic';
  selEl.style.fontStyle=ni;
  document.getElementById('prItalic').classList.toggle('bbl',ni==='italic');
}
function dupEl(){
  if(!selEl)return;
  const cl=selEl.cloneNode(true);
  cl.style.marginLeft=(parseFloat(selEl.style.marginLeft||0)+16)+'px';
  cl.style.marginTop=(parseFloat(selEl.style.marginTop||0)+16)+'px';
  cl.classList.remove('sel');
  cl.id=selEl.id+'_copy'+Date.now();
  selEl.parentNode.appendChild(cl);
  bindEditable(cl);
  toast('✅ Élément dupliqué');
}
function hideEl(){
  if(!selEl)return;
  selEl.style.visibility='hidden';
  deselectAll();
  toast('👁️ Élément masqué (reset pour le rendre visible)');
}
function resetEl(){
  if(!selEl)return;
  selEl.removeAttribute('style');
  showProps(selEl);
  toast('↩️ Élément réinitialisé');
}

// ═══════ REPLACE IMAGE ═══════
function replaceImage(e){
  const f=e.target.files[0]; if(!f)return;
  if(f.type==='application/pdf'){
    importPDFasImage(f,selEl);
  } else {
    const r=new FileReader();
    r.onload=ev=>{
      const img=selEl.querySelector('img');
      if(img){img.src=ev.target.result;img.style.display='block';}
      else selEl.innerHTML=`<img src="${ev.target.result}" style="max-height:100%;max-width:100%;object-fit:contain;">`;
      toast('🖼️ Image remplacée');
    };
    r.readAsDataURL(f);
  }
}
async function importPDFasImage(f,target){
  toast('⏳ Extraction PDF…','warn');
  if(typeof pdfjsLib==='undefined'){
    await new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload=()=>{
        pdfjsLib.GlobalWorkerOptions.workerSrc=
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        res();
      };
      s.onerror=rej;
      document.head.appendChild(s);
    });
  }
  try{
    const ab=await f.arrayBuffer();
    const pdf=await pdfjsLib.getDocument({data:new Uint8Array(ab)}).promise;
    const page=await pdf.getPage(1);
    const vp=page.getViewport({scale:3});
    const tmp=document.createElement('canvas');
    tmp.width=vp.width; tmp.height=vp.height;
    await page.render({canvasContext:tmp.getContext('2d'),viewport:vp}).promise;
    const dataUrl=tmp.toDataURL('image/png',1);
    if(target){
      const img=target.querySelector('img');
      if(img){img.src=dataUrl;img.style.display='block';}
      else target.innerHTML=`<img src="${dataUrl}" style="width:100%;height:100%;object-fit:contain;">`;
    }
    toast('✅ PDF extrait et appliqué !');
  }catch(err){
    console.error('PDF render error:',err);
    toast('❌ Erreur PDF : '+err.message,'err');
  }
}

// ═══════ QR ═══════
function fileQR(e){ const f=e.target.files[0]; if(f) processQRFile(f); }
function dropQR(e){
  e.preventDefault();
  document.getElementById('qrZone').classList.remove('dov');
  const f=e.dataTransfer.files[0]; if(f) processQRFile(f);
}
function processQRFile(f){
  if(f.type==='application/pdf') importQRfromPDF(f);
  else { const r=new FileReader(); r.onload=ev=>setQRImg(ev.target.result); r.readAsDataURL(f); }
}
async function importQRfromPDF(f){
  toast('⏳ Extraction QR du PDF…','warn');
  if(typeof pdfjsLib==='undefined'){
    toast('⏳ Chargement pdf.js…','warn');
    await new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload=()=>{
        pdfjsLib.GlobalWorkerOptions.workerSrc=
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        res();
      };
      s.onerror=rej;
      document.head.appendChild(s);
    });
  }
  try{
    const ab=await f.arrayBuffer();
    const loadTask=pdfjsLib.getDocument({data:new Uint8Array(ab)});
    const pdf=await loadTask.promise;
    const page=await pdf.getPage(1);
    const vp=page.getViewport({scale:3});
    const tmp=document.createElement('canvas');
    tmp.width=vp.width; tmp.height=vp.height;
    const ctx=tmp.getContext('2d');
    await page.render({canvasContext:ctx,viewport:vp}).promise;
    setQRImg(tmp.toDataURL('image/png',1));
    toast('✅ QR extrait du PDF (page 1) !');
  }catch(err){
    console.error('PDF import error:',err);
    toast('❌ Erreur PDF : '+err.message,'err');
  }
}
function setQRImg(dataUrl){
  qrImported=true;
  const c=document.getElementById('elQR');
  c.innerHTML=`<img src="${dataUrl}" style="width:100%;height:100%;object-fit:contain;">`;
  document.getElementById('qrThumb').src=dataUrl;
  document.getElementById('qrThumb').style.display='block';
  const btnClear = document.getElementById('btnClearQR');
  if(btnClear){ btnClear.style.display='flex'; }
  if(window.currentBatchIndex!==undefined && batch[window.currentBatchIndex]){
    batch[window.currentBatchIndex].qrData=dataUrl;
    renderBatch();
    toast('✅ QR importé pour '+batch[window.currentBatchIndex].name);
  } else {
    toast('✅ QR importé');
  }
}
function clearQR(){
  qrImported=false;
  document.getElementById('qrThumb').style.display='none';
  document.getElementById('qrFile').value='';
  const c=document.getElementById('elQR');
  c.innerHTML='';
  const btnClear = document.getElementById('btnClearQR');
  if(btnClear){ btnClear.style.display='none'; }
  if(window.currentBatchIndex!==undefined && batch[window.currentBatchIndex]){
    batch[window.currentBatchIndex].qrData=null;
    renderBatch();
    toast('🗑️ QR effacé pour '+batch[window.currentBatchIndex].name);
  } else {
    toast('🗑️ QR effacé');
  }
}
function refreshQR(){
  // l'utilisateur doit importer un QR (image/PDF) pour remplir la zone
}

// ═══════ MARCHAND ═══════
function liveName(el){
  document.getElementById('nc').textContent=el.value.length;
  document.getElementById('elName').innerText=el.value.toUpperCase()||'NOM DU MARCHAND';
}
function liveCode(el){
  el.value=el.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
  document.getElementById('cc2').textContent=el.value.length;
  buildCodeBoxes(el.value);
}
function applyMerchant(){
  const name=document.getElementById('iName').value.trim().toUpperCase()||'NOM DU MARCHAND';
  const code=document.getElementById('iCode').value.trim().toUpperCase();
  document.getElementById('elName').innerText=name;
  buildCodeBoxes(code);
  toast('✅ Marchand appliqué : '+name);
}
function buildCodeBoxes(code){
  const row=document.getElementById('cboxRow');
  row.innerHTML='';
  const str=(code||'').trim();
  if(!str) return;
  const len=str.length;
  const w=len>15?28:len>10?36:46;
  const h=Math.round(w*1.17);
  const fs=len>15?15:len>10?20:26;
  for(const c of str){
    const b=document.createElement('div');
    b.className='cbox';
    b.style.cssText=`width:${w}px;height:${h}px;font-size:${fs}px;`;
    b.textContent=c;
    row.appendChild(b);
  }
}

// ═══════ DRAG & DROP ELEMENTS ═══════
function bindEditable(el){
  el.addEventListener('click',e=>{
    if(!editMode)return;
    e.stopPropagation();
    selectEl(el);
  });
  if(typeof interact!=='undefined'){
    interact(el).draggable({
      allowFrom: 'body',
      ignoreFrom: 'input, button',
      listeners: {
        start(event){ if(editMode) selectEl(el); },
        move(event){
          if(!editMode) return;
          const dx = event.dx / Z;
          const dy = event.dy / Z;
          const currX = parseFloat(el.style.marginLeft)||0;
          const currY = parseFloat(el.style.marginTop)||0;
          el.style.marginLeft = (currX + dx) + 'px';
          el.style.marginTop = (currY + dy) + 'px';
          updatePosFields(el);
        }
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: '#poster',
          elementRect: { top:0,left:0,bottom:1,right:1 }
        })
      ]
    });
  }
}

function updatePosFields(el){
  const r=el.getBoundingClientRect();
  const pr=document.getElementById('poster').getBoundingClientRect();
  document.getElementById('prX').value=Math.round((r.left-pr.left)/Z);
  document.getElementById('prY').value=Math.round((r.top-pr.top)/Z);
}
function bindAll(){
  document.querySelectorAll('.editable').forEach(bindEditable);
}

// ═══════ ADD TEXT ═══════
function addTextEl(){
  const el=document.createElement('div');
  el.className='editable';
  el.dataset.type='text';
  el.dataset.label='Texte ajouté';
  el.style.cssText="font-family:'Century Gothic',Arial,sans-serif;font-size:20px;font-weight:900;color:#000;text-align:center;cursor:move;padding:3px 6px;border-radius:3px;display:inline-block;white-space:nowrap;";
  el.innerText='Nouveau texte';
  el.contentEditable=editMode?'true':'false';
  document.getElementById('pCard').appendChild(el);
  bindEditable(el);
  selectEl(el);
  toast('✏️ Texte ajouté — cliquez pour sélectionner');
}

// ═══════ IMPORT IMAGE ═══════
function importImageEl(){
  const inp=document.createElement('input');inp.type='file';inp.accept='image/*,.pdf';
  inp.onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    if(f.type==='application/pdf'){
      const el=document.createElement('div');el.className='editable';el.dataset.type='image';el.dataset.label='Image importée';
      el.style.cssText='width:200px;height:100px;cursor:move;display:flex;align-items:center;justify-content:center;';
      document.getElementById('pCard').appendChild(el);
      bindEditable(el);selectEl(el);
      importPDFasImage(f,el);
    } else {
      const r=new FileReader();r.onload=ev=>{
        const el=document.createElement('div');el.className='editable';el.dataset.type='image';el.dataset.label='Image importée';
        el.style.cssText='width:200px;height:100px;cursor:move;display:flex;align-items:center;justify-content:center;';
        el.innerHTML=`<img src="${ev.target.result}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
        document.getElementById('pCard').appendChild(el);
        bindEditable(el);selectEl(el);
        toast('🖼️ Image ajoutée');
      };
      r.readAsDataURL(f);
    }
  };
  inp.click();
}

// ═══════ CSV ═══════
function openCSV(){document.getElementById('csvMod').classList.add('op');}
function fileCSV(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>parseCSV(ev.target.result);r.readAsText(f,'UTF-8');}
function parseCSVModal(){parseCSV(document.getElementById('csvTA').value);document.getElementById('csvMod').classList.remove('op');}
function parseCSV(txt){
  const lines=txt.trim().split('\n').filter(l=>l.trim());
  const items=[];
  for(const l of lines){const p=l.split(/[,;|\t]/);if(p.length>=2)items.push({name:p[0].trim().replace(/["']/g,'').toUpperCase(),code:p[1].trim().replace(/["']/g,'').toUpperCase(),qrData:null});}
  if(!items.length){toast('⚠️ Aucune donnée valide','warn');return;}
  batch=items;renderBatch();toast(`✅ ${items.length} marchand(s) importé(s)`);
  if(batch.length) batchAll();
}
function renderBatch(){
  const bl=document.getElementById('blist');bl.innerHTML='';
  batch.forEach((it,i)=>{
    const d=document.createElement('div');d.className='bi';
    const qrBadge=it.qrData?'<span style="font-size:9px;color:#22c55e;margin-left:6px;">📱 QR</span>':'';
    d.innerHTML=`<div><div class="bi-nm">${it.name}${qrBadge}</div><div class="bi-cd">${it.code}</div></div>
      <div class="bi-bb"><button class="bib bib-ld" onclick="loadBatch(${i})"><i class="fas fa-arrow-right"></i></button>
      <button class="bib bib-dl" onclick="delBatch(${i})">✕</button></div>`;
    bl.appendChild(d);
  });
  document.getElementById('bacts').style.display=batch.length?'flex':'none';
}
function loadBatch(i){
  const it=batch[i];
  window.currentBatchIndex=i;
  document.getElementById('iName').value=it.name;document.getElementById('nc').textContent=it.name.length;
  document.getElementById('iCode').value=it.code;document.getElementById('cc2').textContent=it.code.length;
  applyMerchant();
  if(it.qrData){
    qrImported=true;
    const c=document.getElementById('elQR');
    c.innerHTML=`<img src="${it.qrData}" style="width:100%;height:100%;object-fit:contain;">`;
    document.getElementById('qrThumb').src=it.qrData;
    document.getElementById('qrThumb').style.display='block';
    const btnClear = document.getElementById('btnClearQR');
    if(btnClear){ btnClear.style.display='flex'; }
  } else {
    clearQR();
  }
}
function delBatch(i){batch.splice(i,1);renderBatch();}
function clearBatch(){batch=[];renderBatch();}
async function batchAll(){
  if(!batch.length)return;
  const p=document.getElementById('bprog'),f=document.getElementById('bfill');p.style.display='block';
  for(let i=0;i<batch.length;i++){
    f.style.width=Math.round(i/batch.length*100)+'%';
    loadBatch(i);await new Promise(r=>setTimeout(r,400));
  }
  f.style.width='100%';toast(`✅ ${batch.length} générés`);
  setTimeout(()=>{p.style.display='none';f.style.width='0%';},2000);
}

// ═══════ EXPORT ═══════
async function doExportPDF(){
  if(location.protocol==='file:'){
    toast('❌ Export impossible en mode file://. Lance "serve.bat" puis ouvre http://localhost:8000/index.html','err');
    return;
  }
  toast('⏳ PDF en cours…','warn');
  try{
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    deselectAll();
    const cv = await renderPosterAsCanvas();
    const imgData = cv.toDataURL('image/png',1);
    const {jsPDF}=window.jspdf;
    const fmt=document.getElementById('eFmt').value;
    const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:fmt==='A4'?'a4':'a5'});
    pdf.addImage(imgData,'PNG',0,0,fmt==='A4'?210:148,fmt==='A4'?297:210,undefined,'FAST');
    pdf.save(`Moov_QR_${(document.getElementById('iName').value||'affiche').replace(/\s+/g,'_')}_${fmt}.pdf`);
    toast('✅ PDF exporté !');
  }catch(err){
    console.error(err);
    const msg = err.message||err.toString();
    if(msg.includes('secure')){
      toast('❌ Opération bloquée (canvas sécurisée). Servez la page via HTTP/HTTPS ou utilisez un serveur local.','err');
    } else if (typeof html2canvas==='undefined' || !window.jspdf) {
      toast('❌ Librairies d\'export non chargées. Vérifie ta connexion internet.','err');
    } else {
      toast('❌ '+msg,'err');
    }
  }
}
async function doExportPNG(){
  if(location.protocol==='file:'){
    toast('❌ Export impossible en mode file://. Lance "serve.bat" puis ouvre http://localhost:8000/index.html','err');
    return;
  }
  toast('⏳ PNG en cours…','warn');
  try{
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    deselectAll();
    const cv = await renderPosterAsCanvas();
    const blob = await new Promise((res,rej)=>{
      cv.toBlob(b=>{ if(b)res(b); else rej(new Error('Impossible de créer le blob')); },'image/png',1);
    });
    const a=document.createElement('a');
    a.download=`Moov_QR_${(document.getElementById('iName').value||'affiche').replace(/\s+/g,'_')}_300dpi.png`;
    const url=URL.createObjectURL(blob);
    a.href=url;
    a.click();
    URL.revokeObjectURL(url);
    toast('✅ PNG 300 DPI !');
  }catch(err){
    console.error(err);
    const msg = err.message||err.toString();
    if(msg.includes('secure')){
      toast('❌ Opération bloquée (canvas sécurisée). Servez la page via HTTP/HTTPS ou utilisez un serveur local.','err');
    } else if (typeof html2canvas==='undefined') {
      toast('❌ Librairie d\'export (html2canvas) non chargée. Vérifie ta connexion internet.','err');
    } else {
      toast('❌ '+msg,'err');
    }
  }
}

// export batch — génère un PDF multi-pages contenant chaque affiche du CSV importé
async function batchExportPDF(){
  if(!batch.length){ toast('⚠️ Pas de marchands en batch','warn'); return; }
  if(location.protocol==='file:'){
    toast('❌ Export impossible en mode file://. Lance "serve.bat" puis ouvre http://localhost:8000/index.html','err');
    return;
  }
  toast('⏳ Création PDF multi-pages…','warn');
  try{
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    deselectAll();
    const {jsPDF}=window.jspdf;
    const fmt=document.getElementById('eFmt').value;
    const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:fmt==='A4'?'a4':'a5'});
    const p=document.getElementById('bprog'),f=document.getElementById('bfill');
    if(p){p.style.display='block'; f.style.width='0%';}
    for(let i=0;i<batch.length;i++){
      loadBatch(i);
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const cv=await renderPosterAsCanvas();
      const imgData=cv.toDataURL('image/png',1);
      if(i>0) pdf.addPage();
      pdf.addImage(imgData,'PNG',0,0,fmt==='A4'?210:148,fmt==='A4'?297:210,'FAST');
      if(f) f.style.width=Math.round((i+1)/batch.length*100)+'%';
    }
    pdf.save(`Batch_Marchands_${batch.length}.pdf`);
    toast('✅ PDF batch exporté !');
    if(p){setTimeout(()=>{p.style.display='none';f.style.width='0%';},1500);}
  }catch(err){
    console.error(err);
    toast('❌ '+(err.message||err));
  }
}
async function renderPosterAsCanvas(){
  const poster = document.getElementById('poster');
  const clone = poster.cloneNode(true);
  clone.querySelectorAll('.sel').forEach(e=>e.classList.remove('sel'));

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-9999px';
  wrapper.style.top = '0';
  wrapper.style.background = '#EC6608';
  wrapper.style.padding = '0';
  wrapper.style.margin = '0';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

  const cv = await html2canvas(clone,{
    scale:3,
    useCORS:true,
    allowTaint:true,
    backgroundColor:'#EC6608',
    logging:false
  });

  document.body.removeChild(wrapper);
  return cv;
}
function loadScript(src){return new Promise((res,rej)=>{if(document.querySelector(`script[src="${src}"]`)){res();return;}const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}

// ═══════ UTILS ═══════
function rgb2hex(rgb){
  if(!rgb||rgb==='transparent')return'#000000';
  if(rgb.startsWith('#'))return rgb;
  const m=rgb.match(/\d+/g);if(!m||m.length<3)return'#000000';
  return'#'+[m[0],m[1],m[2]].map(x=>parseInt(x).toString(16).padStart(2,'0')).join('');
}
function toast(msg,type='ok'){
  const el=document.getElementById('toastEl');
  document.getElementById('toastMsg').textContent=msg;
  el.className='toast show '+(type==='warn'?'twn':type==='err'?'ter':'tok');
  setTimeout(()=>el.classList.remove('show'),3200);
}

// ═══════ KEYBOARD ═══════
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  if(e.ctrlKey&&e.key==='p'){e.preventDefault();window.print();}
  if(e.ctrlKey&&e.key==='Enter'){e.preventDefault();doExportPDF();}
  if(e.ctrlKey&&(e.key==='='||e.key==='+')){e.preventDefault();doZoom(0.1);}
  if(e.ctrlKey&&e.key==='-'){e.preventDefault();doZoom(-0.1);}
  if(e.ctrlKey&&e.key==='0'){e.preventDefault();zoomFit();}
  if(!selEl)return;
  const s=e.shiftKey?10:2;
  if(e.key==='ArrowLeft'){e.preventDefault();selEl.style.marginLeft=(parseFloat(selEl.style.marginLeft||0)-s)+'px';}
  if(e.key==='ArrowRight'){e.preventDefault();selEl.style.marginLeft=(parseFloat(selEl.style.marginLeft||0)+s)+'px';}
  if(e.key==='ArrowUp'){e.preventDefault();selEl.style.marginTop=(parseFloat(selEl.style.marginTop||0)-s)+'px';}
  if(e.key==='ArrowDown'){e.preventDefault();selEl.style.marginTop=(parseFloat(selEl.style.marginTop||0)+s)+'px';}
  if(e.key==='Escape')deselectAll();
  if(e.key==='Delete')hideEl();
});

// Clic hors élément = désélection
document.getElementById('poster').addEventListener('click',e=>{
  if(e.target===document.getElementById('poster')||
     e.target===document.getElementById('pCard')||
     e.target===document.getElementById('zoneTop')||
     e.target===document.getElementById('p-bot'))
    deselectAll();
});

// ═══════ INIT ═══════
window.addEventListener('DOMContentLoaded',()=>{
  if(location.protocol==='file:'){
    toast('⚠️ Ouvrez cette page via un serveur local (http://localhost) pour permettre l\'export','warn');
  }
  document.querySelectorAll('img').forEach(i=>i.setAttribute('crossorigin','anonymous'));

  const iName = document.getElementById('iName');
  const iCode = document.getElementById('iCode');
  const iQrTxt = document.getElementById('iQrTxt');
  const nc = document.getElementById('nc');
  const cc2 = document.getElementById('cc2');
  const qrThumb = document.getElementById('qrThumb');
  const qrFile = document.getElementById('qrFile');
  const btnClear = document.getElementById('btnClearQR');
  const elName = document.getElementById('elName');

  if(iName) iName.value='';
  if(iCode) iCode.value='';
  if(iQrTxt) iQrTxt.value='';
  if(nc) nc.textContent='0';
  if(cc2) cc2.textContent='0';
  if(elName) elName.innerText='NOM DU MARCHAND';
  buildCodeBoxes('');

  qrImported=false;
  if(qrThumb) qrThumb.style.display='none';
  if(qrFile) qrFile.value='';
  const elQR = document.getElementById('elQR');
  if(elQR) elQR.innerHTML='';
  if(btnClear) btnClear.style.display='none';

  bindAll();
  applyZ();
  setTimeout(()=>{zoomFit();},200);

  console.log('%c🖨️ QR Poster Studio v2.3','color:#EC6608;font-size:16px;font-weight:900;');
  console.log('%c✅ HTML+CSS — affiche visible, édition directe','color:#22c55e;');
});
