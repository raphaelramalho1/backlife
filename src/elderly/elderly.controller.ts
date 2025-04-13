import { Body, Controller, Post, Headers, Get, Param, Put, Delete } from '@nestjs/common';
import { ElderlyService } from './elderly.service';
import { CreateElderlyDto, ValidatePinDto } from '../dto/elderly.dto';
import { Roles, Role } from '../auth/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('elderly')
export class ElderlyController {
  constructor(
    private readonly elderlyService: ElderlyService,
    private readonly jwtService: JwtService
  ) {}

  @Post('signup')
  @Roles(Role.CAREGIVER)
  async create(
    @Body() createElderlyDto: CreateElderlyDto, 
    @Headers('authorization') authHeader: string
  ) {
    // Extrair o caregiverId do token JWT
    const token = authHeader.split(' ')[1]; // Remove o prefixo "Bearer "
    const payload = this.jwtService.decode(token);
    
    // Criar o idoso com o ID do cuidador extraído do token
    return this.elderlyService.create(createElderlyDto, payload.id);
  }

  @Get()
  @Roles(Role.CAREGIVER)
  async findAll(@Headers('authorization') authHeader: string) {
    // Extrair o caregiverId do token JWT
    const token = authHeader.split(' ')[1]; // Remove o prefixo "Bearer "
    const payload = this.jwtService.decode(token);
    
    // Obter todos os idosos vinculados ao cuidador
    return this.elderlyService.findAllForCaregiver(payload.id);
  }

  @Get(':id')
  @Roles(Role.CAREGIVER)
  async findOne(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    // Extrair o caregiverId do token JWT
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    
    // Obter um idoso específico, verificando se pertence ao cuidador
    return this.elderlyService.findOne(id, payload.id);
  }

  @Put(':id')
  @Roles(Role.CAREGIVER)
  async update(
    @Param('id') id: string, 
    @Body() updateElderlyDto: any, 
    @Headers('authorization') authHeader: string
  ) {
    // Extrair o caregiverId do token JWT
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    
    // Atualizar o idoso, verificando se pertence ao cuidador
    return this.elderlyService.update(id, updateElderlyDto, payload.id);
  }

  @Delete(':id')
  @Roles(Role.CAREGIVER)
  async remove(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    // Extrair o caregiverId do token JWT
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    
    // Remover o idoso, verificando se pertence ao cuidador
    return this.elderlyService.remove(id, payload.id);
  }

  @Post('login')
  async login(@Body() validatePinDto: ValidatePinDto) {
    return this.elderlyService.validatePin(validatePinDto);
  }
}
