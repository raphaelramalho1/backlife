import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

// Define os tipos de roles possíveis
export enum Role {
  CAREGIVER = 'CAREGIVER',
  ELDERLY = 'ELDERLY',
}

// Decorator para definir quais roles podem acessar um endpoint
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    
    // Se não há roles definidos, permite o acesso
    if (!requiredRoles) {
      return true;
    }
    
    const { headers } = context.switchToHttp().getRequest();
    const authHeader = headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    // Extrai o token do cabeçalho de autorização
    const token = authHeader.split(' ')[1];
    
    try {
      // Verifica e decodifica o token
      const payload = this.jwtService.verify(token);
      
      // Verifica se o usuário tem a role necessária
      return requiredRoles.some((role) => payload.role === role);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
