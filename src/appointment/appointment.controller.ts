import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentResponseDto } from '../dto/appointment.dto';
import { JwtService } from '@nestjs/jwt';
import { Roles, Role } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Criar uma nova consulta médica' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.appointmentService.create(createAppointmentDto, payload.id);
  }

  @Get('elderly/:elderlyId')
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Listar todas as consultas de um idoso' })
  async findAllByElderly(
    @Param('elderlyId') elderlyId: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.appointmentService.findAllByElderly(elderlyId, payload.id);
  }

  @Get(':id')
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Obter uma consulta específica' })
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.appointmentService.findOne(id, payload.id);
  }

  @Patch(':id')
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Atualizar uma consulta' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.appointmentService.update(id, updateAppointmentDto, payload.id);
  }

  @Delete(':id')
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Remover uma consulta' })
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    await this.appointmentService.remove(id, payload.id);
    return { message: 'Consulta removida com sucesso' };
  }
}
