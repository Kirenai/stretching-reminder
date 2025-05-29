import { app, BrowserWindow, ipcMain, Notification, Tray, powerMonitor } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import schedule from 'node-schedule';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow: BrowserWindow;
let tray: Tray;
let stretchJob: schedule.Job;

// Función para obtener la ruta correcta a los assets
function getAssetPath(...paths: string[]): string {
  return path.join(
    app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(app.getAppPath(), 'src/assets'),
    ...paths
  );
}

const setAutoLaunch = (enabled: boolean) => {
  if (process.platform === 'win32') {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      args: ['--process-start-args', '"--hidden"']
    });
  }
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  const trayIconName = process.platform === 'win32' ? 'streched.ico' : 'streched.png';
  tray = new Tray(getAssetPath(trayIconName));
  tray.setToolTip('Recordatorio de estiramientos')
  tray.on('click', () => {
    mainWindow.show()
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Iniciar el temporizador de notificaciones
  startNotificationTimer();

  // Configurar inicio automático (habilitado por defecto)
  setAutoLaunch(false);
};

// Función para mostrar la notificación
function showStretchNotification() {
  const notification = new Notification({
    title: '¡Hora de estirarse!',
    body: 'Es momento de tomar un descanso y hacer algunos estiramientos.',
    icon: getAssetPath('streched_64.png'),
    silent: false
  });

  notification.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  notification.show();
}

// Función para iniciar el temporizador de notificaciones
function startNotificationTimer() {
  // Limpiar cualquier intervalo existente
  if (stretchJob) {
    stretchJob.cancel();
  }

  // Mostrar una notificación cada hora, cada cuando en el reloj parque 1:00:00, 2:00:00, etc.
  stretchJob = schedule.scheduleJob('0 0 * * * *', showStretchNotification);

  // También podemos mostrar una notificación inmediatamente para probar
  // Descomenta la siguiente línea para probar cada 30 segundos en el reloj:
  // stretchJob = schedule.scheduleJob('30 * * * * *', showStretchNotification);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  powerMonitor.on('resume', () => {
    // Reiniciar el temporizador de notificaciones al reanudar el sistema
    startNotificationTimer();
  });

  powerMonitor.on('suspend', () => {
    // Cancelar el temporizador de notificaciones al suspender el sistema
    if (stretchJob) {
      stretchJob.cancel();
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('hide-window', () => {
  mainWindow.hide();
});

ipcMain.on('test-notification', () => {
  showStretchNotification();
});

// Agregar estos manejadores para controlar el inicio automático desde la interfaz
ipcMain.on('get-auto-launch', (event) => {
  const settings = app.getLoginItemSettings();
  event.returnValue = settings.openAtLogin;
});


ipcMain.on('set-auto-launch', (event, enabled) => {
  setAutoLaunch(enabled);
});
