export const IPC = {
  DOCUMENTS: {
    GET_ALL: 'documents:getAll',
    GET_BY_ID: 'documents:getById',
    CREATE: 'documents:create',
    UPDATE: 'documents:update',
    DELETE: 'documents:delete',
    GET_VERSIONS: 'documents:getVersions',
  },
} as const;

export const AUTH_CHANNELS = {
  LOGIN: 'auth:login',
  REGISTER: 'auth:register',
  LOGOUT: 'auth:logout',
  GET_CURRENT_USER: 'auth:get-current-user',
} as const;