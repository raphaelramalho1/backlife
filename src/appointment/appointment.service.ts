import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { Elderly } from '../entities/elderly.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Elderly)
    private elderlyRepository: Repository<Elderly>,
  ) {}

  // Verificar se idoso pertence ao cuidador
  private async validateElderlyOwnership(elderlyId: string, caregiverId: string): Promise<void> {
    const elderly = await this.elderlyRepository.findOne({
      where: { id: elderlyId, caregiverId },
    });

    if (!elderly) {
      throw new ForbiddenException('Você não tem permissão para acessar este idoso');
    }
  }

  // Criar nova consulta
  async create(createAppointmentDto: CreateAppointmentDto, caregiverId: string): Promise<Appointment> {
    // Verificar se o idoso pertence ao cuidador
    await this.validateElderlyOwnership(createAppointmentDto.elderlyId, caregiverId);

    const appointment = this.appointmentRepository.create(createAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  // Buscar todas as consultas de um idoso
  async findAllByElderly(elderlyId: string, caregiverId: string): Promise<Appointment[]> {
    // Verificar se o idoso pertence ao cuidador
    await this.validateElderlyOwnership(elderlyId, caregiverId);

    return this.appointmentRepository.find({
      where: { elderlyId },
      order: { datetime: 'ASC' },
    });
  }

  // Buscar uma consulta específica
  async findOne(id: string, caregiverId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['elderly'],
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    // Verificar se o idoso pertence ao cuidador
    await this.validateElderlyOwnership(appointment.elderlyId, caregiverId);

    return appointment;
  }

  // Atualizar uma consulta
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto, caregiverId: string): Promise<Appointment> {
    const appointment = await this.findOne(id, caregiverId);
    
    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  // Remover uma consulta
  async remove(id: string, caregiverId: string): Promise<void> {
    const appointment = await this.findOne(id, caregiverId);
    
    await this.appointmentRepository.remove(appointment);
  }
}
