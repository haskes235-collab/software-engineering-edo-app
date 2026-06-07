import { contextBridge, ipcRenderer } from 'electron';
import { AUTH_CHANNELS, IPC } from '../src/shared/ipcChannels';
import { CreateDocumentDto, UpdateDocumentDto } from '../src/shared/types';
import { register } from 'node:module';
import { getCurrentIsoDate } from '@shared/utils';

contextBridge.exposeInMainWorld('electronAPI', {
  documents: {
    getAll: () => ipcRenderer.invoke(IPC.DOCUMENTS.GET_ALL),
    getById: (id: string) => ipcRenderer.invoke(IPC.DOCUMENTS.GET_BY_ID, id),
    create: (dto: CreateDocumentDto) =>
      ipcRenderer.invoke(IPC.DOCUMENTS.CREATE, dto),
    update: (id: string, dto: UpdateDocumentDto) =>
      ipcRenderer.invoke(IPC.DOCUMENTS.UPDATE, id, dto),
    delete: (id: string) => ipcRenderer.invoke(IPC.DOCUMENTS.DELETE, id),
    getVersions: (id: string) =>
      ipcRenderer.invoke(IPC.DOCUMENTS.GET_VERSIONS, id),
  },
  auth: {
    login: (dto: any) => ipcRenderer.invoke(AUTH_CHANNELS.LOGIN, dto),
    register: (dto: any) => ipcRenderer.invoke(AUTH_CHANNELS.REGISTER, dto),
    logout: () => ipcRenderer.invoke(AUTH_CHANNELS.LOGOUT),
    getCurrentUser: () => ipcRenderer.invoke(AUTH_CHANNELS.GET_CURRENT_USER),
  },
});