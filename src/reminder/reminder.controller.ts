import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto, UpdateReminderDto, ReminderResponseDto } from '../dto/reminder.dto';
import { JwtService } from '@nestjs/jwt';
import { Roles, Role } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reminders')
@ApiBearerAuth()
@Controller('reminders')
export class ReminderController {
  constructor(
    private readonly reminderService: ReminderService,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Criar um novo lembrete' })
  async create(
    @Body() createReminderDto: CreateReminderDto,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.reminderService.create(createReminderDto, payload.id);
  }

  @Get('elderly/:elderlyId')
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Listar todos os lembretes de um idoso' })
  async findAllByElderly(
    @Param('elderlyId') elderlyId: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.reminderService.findAllByElderly(elderlyId, payload.id);
  }

  @Get(':id')
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Obter um lembrete específico' })
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.reminderService.findOne(id, payload.id);
  }

  @Patch(':id')
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Atualizar um lembrete' })
  async update(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    return this.reminderService.update(id, updateReminderDto, payload.id);
  }

  @Delete(':id')
  @Roles(Role.CAREGIVER)
  @ApiOperation({ summary: 'Remover um lembrete' })
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token);
    await this.reminderService.remove(id, payload.id);
    return { message: 'Lembrete removido com sucesso' };
  }
}
