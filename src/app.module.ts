import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users/users.service.js';
import { UsersModule } from './users/users.module.js';
import { EmailService } from './auth/email/email.service.js';
import { AuthService } from './auth/auth.service.js';
import { AuthController } from './auth/auth.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth/jwt-auth.guard.js';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './common/guards/roles/roles.guard.js';
import { TasksModule } from './tasks/tasks.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
      expandVariables : true,
    }),
    JwtModule.register({}),
    UsersModule,
    AuthModule,
    TasksModule,
    AdminModule
  ],
  providers: [UsersService, EmailService, AuthService, 
              { provide: APP_GUARD, useClass: JwtAuthGuard },
              { provide: APP_GUARD, useClass: RolesGuard }],
  controllers: [AuthController],
})
export class AppModule {}
