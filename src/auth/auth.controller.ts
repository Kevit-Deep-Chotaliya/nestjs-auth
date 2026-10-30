import { Req, Res, HttpCode, HttpStatus, Controller, Post, Body, Query, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { Public } from '../common/decorators/public/public.decorator.js';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { registerDto } from './dto/register.dto.js';
import { loginDto } from './dto/login.dto.js';
import type { User } from '../db/schema.js';
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator.js';
import { forgotPasswordDto } from './dto/forgot-password.dto.js';
import { resetPasswordDto } from './dto/reset-password.dto.js';
import { PassThrough } from 'stream';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    //POST /api/auth/register
    @Public()
    @Post("register")
    @ApiOperation({ summary: "Register a new user" })
    async register(@Body() dto: registerDto) {
        return await this.authService.register(dto);
    }

    //GET /api/auth/verify-email?token=...
    @Public()
    @Get("verify-email")
    @ApiOperation({ summary: "Verify email address and auto-login" })
    async verifyEmail(@Query('token') token: string,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.authService.verifyEmail(token, res);
    }

    //POST /api/auth/login
    @Throttle({ default: { ttl: 60000, limit: 5 }})
    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Login and recieve access + refresh tokens" })
    async login(@Body() dto: loginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.authService.login(dto, res);
    }


    //POST /api/auth/refresh
    @Public()
    @Post("refresh")
    @ApiOperation({ summary: "Refresh access token using refresh token cookie " })
    @HttpCode(HttpStatus.OK)
    @ApiCookieAuth()
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const cookies = req.cookies as Record<string, string>;
        const refreshToken = cookies.refresh_token;
        return this.authService.refresh(refreshToken, res);
    }

    //POST /api/auth/logout
    @Post("logout")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Logout and invalidate refresh token" })
    async logout(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.logout(user.id, res);
    }

    //GET /api/auth/me
    @Get("me")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get current authenticated user" })
    me(@CurrentUser() user: User) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
        }
    }

    //POST /api/auth/forgot-password
    @Throttle({ default: { ttl: 60000, limit: 3 }})
    @Public()
    @Post("forgot-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Request a password reset email" })
    async forgotPassword(@Body() dto: forgotPasswordDto) {
        return await this.authService.forgotPassword(dto.email);
    }

    //POST /api/auth/reset-password
    @Public()
    @Post("reset-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Reset password using token from email" })
    async resetPassword(@Body() dto: resetPasswordDto) {
        return await this.authService.resetPassword(dto.token, dto.password);
    }

}
