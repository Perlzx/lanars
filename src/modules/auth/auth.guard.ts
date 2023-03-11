import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext) {
    if (this.reflector.get<boolean>('isPublic', context.getHandler())) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    try {
      const [type, token] = req.headers.authorization.split(' ');

      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User is not authorized' });
      }

      const user = this.jwtService.verify(token);
      req.user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }
  }
}
