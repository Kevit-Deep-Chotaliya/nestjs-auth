import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../../users/users.service.js';
import { IS_PUBLIC_KEY } from '../../decorators/public/public.decorator.js';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("No access token provided");
    }

    let payload: { sub: string, email: string, role: string }

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("JWT_ACCESS_SECRET")
      })
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }

    const user = await this.usersService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException("User no longer exists");
    }

    request.user = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (
        request.headers as unknown as Record<string, string>
      ).authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

}
