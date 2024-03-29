/* eslint-disable camelcase */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import { exposeIpcMainRxStorage } from 'rxdb/plugins/electron';
import { getRxStorageLoki } from 'rxdb/plugins/storage-lokijs';
import LokiFsStructuredAdapter from 'lokijs/src/loki-fs-structured-adapter.js';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

let mainWindow: BrowserWindow | null = null;

function setUpCustomExtensions() {
  const storage = getRxStorageLoki({
    adapter: new LokiFsStructuredAdapter(),
  });

  exposeIpcMainRxStorage({
    key: 'main-storage',
    storage,
    ipcMain,
  });
}

function sendStatusToWindow(text: any) {
  log.info(text);
  mainWindow?.webContents.send('ipc-example', text);
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    sendStatusToWindow('Constructor');
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', () => {
      sendStatusToWindow('Checking for update...');
    });
    autoUpdater.on('update-available', (info: any) => {
      sendStatusToWindow(`Update available: ${info}`);
    });
    autoUpdater.on('update-not-available', (info: any) => {
      sendStatusToWindow(`Update not available: ${info}`);
    });
    autoUpdater.on('error', (err) => {
      sendStatusToWindow(`Error in auto-updater. ${err}`);
    });
    autoUpdater.on('download-progress', (progressObj: any) => {
      let log_message = `Download speed: ${progressObj.bytesPerSecond}`;
      log_message = `${log_message} - Downloaded ${progressObj.percent}%`;
      log_message = `${log_message} (${progressObj.transferred}/${progressObj.total})`;
      sendStatusToWindow(log_message);
    });
    autoUpdater.on('update-downloaded', (info: any) => {
      console.log('Update downloaded', info);
    });
  }
}

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test 111: ${pingPong}`;
  // console.log(msgTemplate(arg));
  autoUpdater.checkForUpdatesAndNotify();
  event.reply('ipc-example', msgTemplate(`pong 123 ${arg}!!!,`));
});

ipcMain.on('open-file-dialog', (event) => {
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        event.reply('selected-file', result.filePaths[0]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  const a = new AppUpdater();
  console.log(a);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    setUpCustomExtensions();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
