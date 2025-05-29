// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  hideWindow: () => ipcRenderer.send('hide-window'),
  testNotification: () => ipcRenderer.send('test-notification'),
  // Nuevas funciones para controlar el inicio automático
  getAutoLaunchEnabled: () => ipcRenderer.sendSync('get-auto-launch'),
  setAutoLaunchEnabled: (enabled: boolean) => ipcRenderer.send('set-auto-launch', enabled)
});
