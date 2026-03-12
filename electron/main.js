/**
 * QR Poster Studio — main.js
 * Processus principal Electron (Node.js)
 * Moov Money Gabon © 2026
 */

'use strict';

const { app, BrowserWindow, Menu, shell, dialog, ipcMain, nativeTheme } = require('electron');
const path  = require('path');
const fs    = require('fs');
const os    = require('os');

// ─── Sécurité : désactiver le remote module ───────────────────────────────────
app.disableHardwareAcceleration && (() => {})(); // optionnel selon GPU

// ─── Singleton : une seule instance ──────────────────────────────────────────
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

// ─── Chemins ─────────────────────────────────────────────────────────────────
const isDev        = !app.isPackaged;
const rootDir      = isDev
  ? path.join(__dirname, '..')          // dossier racine du projet en dev
  : path.join(process.resourcesPath);  // ressources packagées en prod
const appDataDir   = path.join(app.getPath('userData'), 'QR-Poster-Studio');
const exportsDir   = path.join(app.getPath('documents'), 'QR Poster Studio', 'Exports');

// ─── Créer les dossiers utilisateur ──────────────────────────────────────────
function ensureDirs() {
  [appDataDir, exportsDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

// ─── Fenêtre principale ───────────────────────────────────────────────────────
let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width:           1280,
    height:          860,
    minWidth:        900,
    minHeight:       600,
    title:           'QR Poster Studio — Moov Money Gabon',
    backgroundColor: '#EC6608',
    show:            false,   // affiché après ready-to-show
    webPreferences: {
      preload:              path.join(__dirname, 'preload.js'),
      contextIsolation:     true,
      nodeIntegration:      false,
      sandbox:              false,
      webSecurity:          true,
      allowRunningInsecureContent: false,
      spellcheck:           false,
    },
  });

  // ── Icône taskbar Windows ──────────────────────────────────────────────────
  const iconPath = path.join(__dirname, 'build', 'icon.ico');
  if (fs.existsSync(iconPath)) mainWindow.setIcon(iconPath);

  // ── Charger l'interface ────────────────────────────────────────────────────
  const entryFile = path.join(rootDir, 'index.html');
  mainWindow.loadFile(entryFile);

  // ── Afficher proprement ────────────────────────────────────────────────────
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
  });

  // ── Ouvrir les liens externes dans le navigateur du système ───────────────
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ─── Menu application ─────────────────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label:       '📄 Nouveau poster',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.executeJavaScript('resetForm && resetForm()'),
        },
        {
          label:       '📂 Importer CSV…',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const { filePaths } = await dialog.showOpenDialog(mainWindow, {
              title:      'Importer un fichier CSV',
              filters:    [{ name: 'CSV', extensions: ['csv', 'txt'] }],
              properties: ['openFile'],
            });
            if (filePaths[0]) {
              const content = fs.readFileSync(filePaths[0], 'utf8');
              mainWindow?.webContents.send('csv-loaded', content);
            }
          },
        },
        {
          label:       '📥 Importer QR (PDF/PNG)…',
          accelerator: 'CmdOrCtrl+I',
          click: async () => {
            const { filePaths } = await dialog.showOpenDialog(mainWindow, {
              title:      'Importer un QR code',
              filters:    [
                { name: 'PDF / Image', extensions: ['pdf', 'png', 'jpg', 'jpeg'] },
              ],
              properties: ['openFile'],
            });
            if (filePaths[0]) {
              const buffer  = fs.readFileSync(filePaths[0]);
              const base64  = buffer.toString('base64');
              const ext     = path.extname(filePaths[0]).toLowerCase().replace('.', '');
              mainWindow?.webContents.send('qr-file-loaded', { base64, ext });
            }
          },
        },
        { type: 'separator' },
        {
          label:       '💾 Enregistrer poster (PNG)…',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.executeJavaScript('exportPNG && exportPNG()'),
        },
        {
          label:       '🖨️ Exporter PDF…',
          accelerator: 'CmdOrCtrl+P',
          click: () => mainWindow?.webContents.executeJavaScript('exportPDF && exportPDF()'),
        },
        { type: 'separator' },
        {
          label:       '📁 Ouvrir dossier Exports',
          click: () => shell.openPath(exportsDir),
        },
        { type: 'separator' },
        {
          label:       'Quitter',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Édition',
      submenu: [
        { label: 'Annuler',   accelerator: 'CmdOrCtrl+Z', role: 'undo'  },
        { label: 'Rétablir',  accelerator: 'CmdOrCtrl+Y', role: 'redo'  },
        { type: 'separator' },
        { label: 'Couper',    accelerator: 'CmdOrCtrl+X', role: 'cut'   },
        { label: 'Copier',    accelerator: 'CmdOrCtrl+C', role: 'copy'  },
        { label: 'Coller',    accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Tout sélectionner', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
      ],
    },
    {
      label: 'Affichage',
      submenu: [
        {
          label:       'Plein écran',
          accelerator: 'F11',
          click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()),
        },
        {
          label:       'Zoom avant',
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            const z = mainWindow?.webContents.getZoomFactor() || 1;
            mainWindow?.webContents.setZoomFactor(Math.min(z + 0.1, 3));
          },
        },
        {
          label:       'Zoom arrière',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const z = mainWindow?.webContents.getZoomFactor() || 1;
            mainWindow?.webContents.setZoomFactor(Math.max(z - 0.1, 0.3));
          },
        },
        {
          label:       'Zoom réel (100%)',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow?.webContents.setZoomFactor(1),
        },
        { type: 'separator' },
        {
          label:       '🛠️ Outils développeur',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow?.webContents.toggleDevTools(),
        },
        {
          label: 'Recharger',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow?.reload(),
        },
      ],
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: '📖 Guide utilisateur',
          click: () => {
            const guide = path.join(__dirname, 'README-BUILD.md');
            if (fs.existsSync(guide)) shell.openPath(guide);
          },
        },
        { type: 'separator' },
        {
          label: 'ℹ️ À propos',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type:    'info',
              title:   'QR Poster Studio',
              message: 'QR Poster Studio v1.0.0',
              detail:  [
                'Générateur de posters marchands GIMACPAY / Moov Money',
                '',
                'Moov Money Gabon © 2026',
                'Tous droits réservés',
                '',
                `Electron  : ${process.versions.electron}`,
                `Chrome    : ${process.versions.chrome}`,
                `Node.js   : ${process.versions.node}`,
                `Plateforme: ${process.platform} ${process.arch}`,
              ].join('\n'),
              buttons: ['OK'],
            });
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ─── IPC handlers ─────────────────────────────────────────────────────────────

/** Sauvegarder un fichier exporté (PNG ou PDF) */
ipcMain.handle('save-file', async (_event, { defaultName, buffer, mimeType }) => {
  const ext = mimeType === 'application/pdf' ? 'pdf' : 'png';
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title:       'Enregistrer le poster',
    defaultPath: path.join(exportsDir, defaultName || `poster.${ext}`),
    filters: [
      { name: ext.toUpperCase(), extensions: [ext] },
      { name: 'Tous les fichiers', extensions: ['*'] },
    ],
  });
  if (canceled || !filePath) return { success: false };
  try {
    const data = Buffer.from(buffer);
    fs.writeFileSync(filePath, data);
    shell.showItemInFolder(filePath);
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

/** Lire un fichier local (CSV, PDF, PNG) */
ipcMain.handle('read-file', async (_event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return { success: true, base64: buffer.toString('base64') };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

/** Obtenir les chemins utiles */
ipcMain.handle('get-paths', () => ({
  exports:  exportsDir,
  appData:  appDataDir,
  home:     app.getPath('home'),
  desktop:  app.getPath('desktop'),
  documents: app.getPath('documents'),
}));

/** Ouvrir dossier Exports */
ipcMain.handle('open-exports', () => shell.openPath(exportsDir));

/** Dialogue sélection fichier (appelé depuis le renderer) */
ipcMain.handle('open-file-dialog', async (_event, { title, extensions }) => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title:      title || 'Ouvrir un fichier',
    filters:    [{ name: 'Fichiers', extensions: extensions || ['*'] }],
    properties: ['openFile'],
  });
  if (canceled || !filePaths[0]) return null;
  const buffer = fs.readFileSync(filePaths[0]);
  return {
    filePath: filePaths[0],
    base64:   buffer.toString('base64'),
    ext:      path.extname(filePaths[0]).toLowerCase().replace('.', ''),
    name:     path.basename(filePaths[0]),
  };
});

// ─── Cycle de vie de l'app ───────────────────────────────────────────────────
app.whenReady().then(() => {
  ensureDirs();
  buildMenu();
  createMainWindow();

  // macOS : recréer la fenêtre si on clique sur l'icône du dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Deuxième instance → focus sur la fenêtre existante
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ─── Gestion des erreurs non capturées ───────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('[main] uncaughtException:', err);
  dialog.showErrorBox('Erreur inattendue', err.message || String(err));
});
