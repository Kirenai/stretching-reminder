/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

export interface IElectronAPI {
  hideWindow: () => void;
  testNotification: () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
