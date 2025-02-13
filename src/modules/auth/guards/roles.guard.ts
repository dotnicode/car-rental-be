import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log('Request user:', request.user);

    if (!request.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    if (!request.user.roles) {
      throw new UnauthorizedException('Usuario no tiene roles definidos');
    }

    return requiredRoles.some((role) => request.user.roles.includes(role));
  }
}
