import { app } from 'electron';

// Establece la aplicación para que se inicie automáticamente al iniciar sesión
export const setAutoLaunch = (enabled: boolean) => {
  if (process.platform === 'win32') {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      args: ['--process-start-args', '"--hidden"']
    });
  }
}
