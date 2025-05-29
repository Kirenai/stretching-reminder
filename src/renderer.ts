/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

console.log('👋 This message is being logged by "renderer.ts", included via Vite');

document.getElementById('minimizar').onclick = () => window.electronAPI.hideWindow();

document.getElementById('test-notification')?.addEventListener('click', () => {
  window.electronAPI.testNotification();
});

document.body.classList.add('dark');

const themeButton = document.getElementById('theme');
const icon = document.getElementById('icon');

themeButton.onclick = () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    icon.className = 'moon';
    icon.textContent = '🌙';
  } else {
    icon.className = 'sun';
    icon.textContent = '☀️';
  }
}

// Controlar el inicio automático
const autoLaunchToggle = document.getElementById('auto-launch-toggle') as HTMLInputElement;
if (autoLaunchToggle) {
  // Obtener el estado actual
  autoLaunchToggle.checked = window.electronAPI.getAutoLaunchEnabled();

  // Manejar cambios
  autoLaunchToggle.addEventListener('change', () => {
    window.electronAPI.setAutoLaunchEnabled(autoLaunchToggle.checked);
  });
}

