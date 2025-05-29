import { app } from 'electron';
import path from 'node:path';

// Función para obtener la ruta correcta a los assets
export function getAssetPath(...paths: string[]): string {
  return path.join(
    app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(app.getAppPath(), 'src/assets'),
    ...paths
  );
}
