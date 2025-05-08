import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { CreateMedicationDto, UpdateMedicationDto, MedicationResponseDto } from '../dto/medication.dto';
import { JwtService } from '@nestjs/jwt';
import { Roles, Role } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ElderlyOwnerGuard } from '../auth/elderly-owner.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('medications')
@ApiBearerAuth()
@Controller('medications')
export class MedicationController {
  constructor(
    private readonly medicationService: MedicationService,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  @Roles(Role.CAREGIVER)
  @UseGuards(JwtAuthGuard, ElderlyOwnerGuard)
  @ApiOperation({ summary: 'Criar um novo medicamento' })
  async create(
    @Body() createMedicationDto: CreateMedicationDto,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.medicationService.create(createMedicationDto, payload.id);
  }

  @Get('elderly/:elderlyId')
  @Roles(Role.CAREGIVER)
  @UseGuards(JwtAuthGuard, ElderlyOwnerGuard)
  @ApiOperation({ summary: 'Listar todos os medicamentos de um idoso' })
  async findAllByElderly(
    @Param('elderlyId') elderlyId: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.medicationService.findAllByElderly(elderlyId, payload.id);
  }

  @Get(':id')
  @Roles(Role.CAREGIVER)
  @UseGuards(JwtAuthGuard, ElderlyOwnerGuard)
  @ApiOperation({ summary: 'Obter um medicamento específico' })
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.medicationService.findOne(id, payload.id);
  }

  @Patch(':id')
  @Roles(Role.CAREGIVER)
  @UseGuards(JwtAuthGuard, ElderlyOwnerGuard)
  @ApiOperation({ summary: 'Atualizar um medicamento' })
  async update(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.medicationService.update(id, updateMedicationDto, payload.id);
  }

  @Delete(':id')
  @Roles(Role.CAREGIVER)
  @UseGuards(JwtAuthGuard, ElderlyOwnerGuard)
  @ApiOperation({ summary: 'Remover um medicamento' })
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    await this.medicationService.remove(id, payload.id);
    return { message: 'Medicamento removido com sucesso' };
  }
}
