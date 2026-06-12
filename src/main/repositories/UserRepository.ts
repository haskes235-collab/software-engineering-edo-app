import { eq } from 'drizzle-orm';
import { users, DbUser } from '../db/schema';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';

export class UserRepository {
    constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

    create(user: Omit<DbUser, 'id' | 'createdAt'>): DbUser {
        this.db.insert(users).values(user).run();

        return this.findByEmail(user.email)!;
    }

    findByEmail(email: string): DbUser | null {
        return (
            this.db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .get() ?? null
        );
    }

    findById(id: number): DbUser | null {
        return (
            this.db
                .select()
                .from(users)
                .where(eq(users.id, id))
                .get() ?? null
        );
    }

    getAll(): DbUser[] {
        return this.db
            .select()
            .from(users)
            .all();
    }
}