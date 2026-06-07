export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Удобные фабрики
export const AuthErrors = {
  USER_EXISTS: (email: string) =>
    new AppError(`Пользователь с email ${email} уже существует`, 'USER_EXISTS', 409),

  INVALID_CREDENTIALS: () =>
    new AppError('Неверный email или пароль', 'INVALID_CREDENTIALS', 401),

  USER_NOT_FOUND: () =>
    new AppError('Пользователь не найден', 'USER_NOT_FOUND', 404),

  VALIDATION_ERROR: (field: string, message: string) =>
    new AppError(`${field}: ${message}`, 'VALIDATION_ERROR', 400),
};