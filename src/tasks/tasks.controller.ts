import { Controller, Get, Post, Patch, Delete, Body, Param, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Createtaskdto } from './dto/create-task.dto.js';
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator.js';
import { type User } from '../db/schema.js';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags("Tasks")
@UseInterceptors(CacheInterceptor)
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @Get()
    @CacheKey("ALL-TASKS")
    @CacheTTL(0)
    @ApiOperation({ summary: "Get all tasks for current User" })
    findAll(@CurrentUser() user: User) {
        console.log("INSIDE_CONTROLLER");
        return this.tasksService.findAllForUser(user.id)
    }

    @Post()
    @ApiOperation({ summary: "Create a new Task" })
    create(@CurrentUser() user: User, @Body() dto: Createtaskdto) {
        return this.tasksService.create(user.id, dto)
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update a task" })
    update(@CurrentUser() user: User, 
           @Param("id") id: string, 
           @Body() dto: Partial<Createtaskdto>
        ){
            return this.tasksService.update(id, user.id, dto)
        }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a task" })
    remove(@CurrentUser() user: User, 
            @Param("id") id: string 
          ){
            return this.tasksService.delete(id, user.id)
          }
}
