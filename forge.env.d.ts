/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

export interface IElectronAPI {
  hideWindow: () => void;
  testNotification: () => void;
  getAutoLaunchEnabled: () => boolean;
  setAutoLaunchEnabled: (enabled: boolean) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
