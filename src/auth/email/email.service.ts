import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor(private configService: ConfigService) {
        this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
    }

    async sendVerificationEmail(email: string, token: string) {
        const appUrl = this.configService.get("APP_URL");
        const verificationUrl = `${appUrl}/api/auth/verify-email?token=${token}`

        await this.resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: 'verify your email',
            html : `<h2>Welcome.! Please verify your email..</h2>
            <p>click the link below to verify your email address.This link will be expires in 24 hours.</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>If you didn't create an account. you can safely ignore this email.</p>`
        })
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const appUrl = this.configService.get("APP_URL");
        const resetUrl = `${appUrl}/api/auth/reset-password?token=${token}`

        await this.resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: 'Reset your password',
            html : `<h2>Password Reset Request</h2>
            <p>click the link below to reset your password.This link will be expires in 1 hour.</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>If you didn't request a password reset. you can safely ignore this email.</p>`
        })
    }
}
