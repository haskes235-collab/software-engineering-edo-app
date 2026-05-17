export interface IBaseRepository<T> {
  getAll(): Promise<readonly T[]>;
  getById(id: string): Promise<T | undefined>;
  create(dto: unknown): Promise<T>;
  update(id: string, dto: unknown): Promise<T>;
  delete(id: string): Promise<void>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  abstract getAll(): Promise<readonly T[]>;
  abstract getById(id: string): Promise<T | undefined>;
  abstract create(dto: unknown): Promise<T>;
  abstract update(id: string, dto: unknown): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
