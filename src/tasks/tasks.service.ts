import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { db } from '../db/index.js';
import { tasks } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { Createtaskdto } from './dto/create-task.dto.js';
import { CreateApiKeyOptions } from 'resend';
import { not } from 'supertest/lib/cookies.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';


@Injectable()
export class TasksService {

    constructor(@Inject("CACHE_MANAGER") private cache: Cache) {}

    async findAllForUser(userId: string) {

        // const cached = await this.cache.get("tasks:all");
        // if (cached) {
        //     console.log("Cache Hit: get data from cache");
        //     return cached;
        // }

        // console.log("Cache Miss: get data from database");
        // const data = await db.query.tasks.findMany({
        //     where: eq(tasks.userId, userId)
        // })
        // console.log("setting data into cache for 60 seconds")
        // await this.cache.set('tasks:all', data, 60000);
        // await this.cache.del('tasks:all');
        // return data;
        console.log("INSIDE_SERVICE");
        return db.query.tasks.findMany({
            where: eq(tasks.userId, userId)
        })
    }

    async create(userId: string, dto: Createtaskdto) {
        const [task] = await db
        .insert(tasks)
        .values({...dto, userId})
        .returning()

        return task;
    }

    async update(id: string, userId: string, data: Partial<Createtaskdto>) {
        const task = await db.query.tasks.findFirst({
            where: eq(tasks.id, id),
        })

        if (!task) throw new NotFoundException("Task not found");

        if (task.userId !== userId) {
            throw new ForbiddenException("You do not own this task");
        }

        const [updated] = await db
        .update(tasks)
        .set({...data, updatedAt: new Date()})
        .where(and(eq(tasks.id, id ), eq(tasks.userId, userId)))
        .returning()

        return updated;
    }

    async delete(id: string, userId: string) {
        const task = await db.query.tasks.findFirst({
            where: eq(tasks.id, id)
        })

        if (!task) throw new NotFoundException("Task not found");

         if (task.userId !== userId) {
            throw new ForbiddenException("You do not own this task");
        }

        await db.delete(tasks).where(eq(tasks.id, id));

        return { message: "Task deleted successfully"}
    }
}
