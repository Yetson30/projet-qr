/**
 * QR Poster Studio — preload.js
 * Pont sécurisé entre le renderer (UI) et le processus principal (Node.js)
 * Utilise contextBridge pour exposer uniquement les APIs nécessaires
 * Moov Money Gabon © 2026
 */

'use strict';

const { contextBridge, ipcRenderer } = require('electron');

// ─── API exposée au renderer via window.electronAPI ──────────────────────────
contextBridge.exposeInMainWorld('electronAPI', {

  // ── Informations sur l'environnement ──────────────────────────────────────
  isElectron: true,
  platform:   process.platform,   // 'win32' | 'darwin' | 'linux'
  version:    process.versions.electron,

  // ── Sauvegarder un fichier exporté (PNG ou PDF) ───────────────────────────
  // buffer : ArrayBuffer | Uint8Array
  // mimeType : 'image/png' | 'application/pdf'
  saveFile: (defaultName, buffer, mimeType) =>
    ipcRenderer.invoke('save-file', {
      defaultName,
      buffer: Array.from(new Uint8Array(buffer)),
      mimeType,
    }),

  // ── Lire un fichier local (retourne base64) ───────────────────────────────
  readFile: (filePath) =>
    ipcRenderer.invoke('read-file', filePath),

  // ── Obtenir les chemins système ───────────────────────────────────────────
  getPaths: () =>
    ipcRenderer.invoke('get-paths'),

  // ── Ouvrir le dossier Exports dans l'explorateur ─────────────────────────
  openExports: () =>
    ipcRenderer.invoke('open-exports'),

  // ── Dialogue de sélection de fichier (depuis le renderer) ─────────────────
  // extensions : ['pdf','png','jpg'] par exemple
  openFileDialog: (title, extensions) =>
    ipcRenderer.invoke('open-file-dialog', { title, extensions }),

  // ── Écouter les événements envoyés par main.js ────────────────────────────
  // Exemple : main envoie 'csv-loaded' quand l'utilisateur ouvre un CSV via le menu
  onCsvLoaded:    (callback) => ipcRenderer.on('csv-loaded',    (_e, data) => callback(data)),
  onQrFileLoaded: (callback) => ipcRenderer.on('qr-file-loaded', (_e, data) => callback(data)),

  // ── Supprimer les listeners (bonne pratique pour éviter les fuites) ───────
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// ─── Log de confirmation ──────────────────────────────────────────────────────
console.log('%c⚡ Electron preload ready — window.electronAPI disponible',
  'color:#EC6608;font-weight:bold;');
