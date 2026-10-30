import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users, type NewUser } from '../db/schema.js';
import { type Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {

    constructor(@Inject(CACHE_MANAGER) private cache: Cache) { }

    async findByVerificationToken(token: string) {
        return db.query.users.findFirst({
            where: eq(users.verificationToken, token)
        });
    }

    async findByResetToken(token: string) {
        return db.query.users.findFirst({
            where: eq(users.resetToken, token)
        });
    }

    async findUserByEmail(email: string) {
        return db.query.users.findFirst({
            where: eq(users.email, email),
        });
    }

    async findUserById(id: string) {
        return db.query.users.findFirst({
            where: eq(users.id, id),
        });
    }

    async create(data: NewUser) {
        const [user] = await db.insert(users).values(data).returning()
        return user;
    }

    async update(id: string, data: Partial<typeof users.$inferInsert>) {
        const [user] = await db
            .update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning()

        return user;
    }

    async findAll() {
        const cached = await this.cache.get('users:all')

        if (cached) {
            console.log("Cache Hit: returning data from cache");
            return cached;
        }

        console.log("Cache Miss: returning data from database");
        const data = await db.query.users.findMany();
        console.log("setting data in cache for 60 seconds");
        return await this.cache.set('users:all', data, 60000);
    }

    async delete(id: string) {
        await db.delete(users).where(eq(users.id, id));
    }
}

