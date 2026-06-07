"use strict";
const electron = require("electron");
const IPC = {
  DOCUMENTS: {
    GET_ALL: "documents:getAll",
    GET_BY_ID: "documents:getById",
    CREATE: "documents:create",
    UPDATE: "documents:update",
    DELETE: "documents:delete",
    GET_VERSIONS: "documents:getVersions"
  }
};
const AUTH_CHANNELS = {
  LOGIN: "auth:login",
  REGISTER: "auth:register",
  LOGOUT: "auth:logout",
  GET_CURRENT_USER: "auth:get-current-user"
};
electron.contextBridge.exposeInMainWorld("electronAPI", {
  documents: {
    getAll: () => electron.ipcRenderer.invoke(IPC.DOCUMENTS.GET_ALL),
    getById: (id) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.GET_BY_ID, id),
    create: (dto) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.CREATE, dto),
    update: (id, dto) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.UPDATE, id, dto),
    delete: (id) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.DELETE, id),
    getVersions: (id) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.GET_VERSIONS, id)
  },
  auth: {
    login: (dto) => electron.ipcRenderer.invoke(AUTH_CHANNELS.LOGIN, dto),
    register: (dto) => electron.ipcRenderer.invoke(AUTH_CHANNELS.REGISTER, dto),
    logout: () => electron.ipcRenderer.invoke(AUTH_CHANNELS.LOGOUT),
    getCurrentUser: () => electron.ipcRenderer.invoke(AUTH_CHANNELS.GET_CURRENT_USER)
  }
});
