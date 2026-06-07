import Database from "better-sqlite3";
import { User } from '../../shared/types';

export class UserRepository {
    constructor(private db: Database.Database) {}

    create(user: Omit<User, 'id' | 'createdAt'>): User {
        const stmt = this.db.prepare(`
            INSERT INTO users (email, name, password)
            VALUES (@email, @name, @password)
        `);
        const result = stmt.run(user);
        return this.findById(result.lastInsertRowid as number)!;
    }

    findByEmail(email: string): User | null {
        const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email) as User | null;
    }

    findById(id: number):User | null{
        const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id) as User | null;
    }

    getAll(): User[] {
        const stmt = this.db.prepare('SELECT * FROM users');
        return stmt.all() as User[];
    }
}