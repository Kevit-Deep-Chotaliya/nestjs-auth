import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users/users.service.js';
import { UsersModule } from './users/users.module.js';
import { EmailService } from './auth/email/email.service.js';
import { AuthService } from './auth/auth.service.js';
import { AuthController } from './auth/auth.controller.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
      expandVariables : true,
    }),
    UsersModule,
    AuthModule
  ],
  providers: [UsersService, EmailService, AuthService],
  controllers: [AuthController],
})
export class AppModule {}
