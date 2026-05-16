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
electron.contextBridge.exposeInMainWorld("electronAPI", {
  documents: {
    getAll: () => electron.ipcRenderer.invoke(IPC.DOCUMENTS.GET_ALL),
    getById: (id) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.GET_BY_ID, id),
    create: (dto) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.CREATE, dto),
    update: (id, dto) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.UPDATE, id, dto),
    delete: (id) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.DELETE, id),
    getVersions: (id) => electron.ipcRenderer.invoke(IPC.DOCUMENTS.GET_VERSIONS, id)
  }
});
