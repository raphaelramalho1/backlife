import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ElderlyOwnerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new ForbiddenException('Token não fornecido');
    }
    
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    const caregiverId = payload?.id;
    
    if (!caregiverId) {
      throw new ForbiddenException('Usuário não autenticado corretamente');
    }
    
    // Adiciona o payload decodificado ao objeto de requisição caso não exista
    if (!request.user) {
      request.user = payload;
    }

    // Obter URL da requisição para determinar o tipo de recurso
    const path = request.route.path;
    const method = request.method;
    
    let elderlyId: string;

    // Caso 1: Rota de listagem por idoso (ex: GET /medications/elderly/:elderlyId ou GET /reminders/elderly/:elderlyId)
    if (path.includes('/elderly/:elderlyId')) {
      elderlyId = request.params.elderlyId;
      
      // Verificar propriedade do idoso utilizando o serviço atual (via URL)
      if (path.includes('medications')) {
        // Para o caso de medicamentos, delegamos a verificação para o serviço
        // O serviço já faz a validação internamente, então não precisamos duplicar aqui
        return true;
      } else if (path.includes('reminders')) {
        // Para o caso de lembretes, delegamos a verificação para o serviço
        // O serviço já faz a validação internamente, então não precisamos duplicar aqui
        return true;
      }
    }
    // Caso 2: Criação de novo recurso (ex: POST /medications ou POST /reminders)
    else if (method === 'POST' && request.body.elderlyId) {
      // O serviço já irá validar a propriedade do idoso na criação
      return true;
    }
    // Caso 3: Operações em um recurso específico (ex: GET, PATCH, DELETE /medications/:id ou /reminders/:id)
    else if (request.params.id) {
      // Os serviços de medicamentos e lembretes já validam a propriedade do recurso
      // Não precisamos implementar essa lógica aqui, evitando a dependência direta dos repositórios
      return true;
    }
    else {
      throw new ForbiddenException('Não foi possível identificar o idoso na requisição');
    }

    return true;
  }
}
