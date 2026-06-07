import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { AUTH_CHANNELS } from '../../../shared/ipcChannels';
import { AuthService } from '../../services/AuthService';
import { UserRepository } from '../../repositories/UserRepository';
import { AppError } from '../../../shared/errors';

export function registerAuthHandlers(db: any) {
  const userRepo = new UserRepository(db);
  const authService = new AuthService(userRepo);

  const handleWithError = (channel: string, handler: Function) => {
    ipcMain.handle(channel, async (event: IpcMainInvokeEvent, ...args: any[]) => {
      try {
        return await handler(...args);
      } catch (error) {
        console.error(`[Auth] Error in ${channel}:`, error);

        if (error instanceof AppError) {
          return {
            error: {
              message: error.message,
              code: error.code,
              statusCode: error.statusCode,
            }
          };
        }

        // Неизвестная ошибка
        return {
          error: {
            message: 'Внутренняя ошибка сервера',
            code: 'INTERNAL_ERROR',
            statusCode: 500,
          }
        };
      }
    });
  };

  handleWithError(AUTH_CHANNELS.REGISTER, (dto: any) => authService.register(dto));
  handleWithError(AUTH_CHANNELS.LOGIN, (dto: any) => authService.login(dto));
  handleWithError(AUTH_CHANNELS.LOGOUT, () => authService.logout());
  handleWithError(AUTH_CHANNELS.GET_CURRENT_USER, () => authService.getCurrentUser());
}