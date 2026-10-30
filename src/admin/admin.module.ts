import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { UsersService } from '../users/users.service.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [UsersModule],
  controllers: [AdminController]
})
export class AdminModule {}
