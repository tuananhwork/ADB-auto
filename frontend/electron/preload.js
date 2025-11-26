import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => console.log('preload connected'),
});
