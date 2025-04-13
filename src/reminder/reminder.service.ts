import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../entities/reminder.entity';
import { CreateReminderDto, UpdateReminderDto } from '../dto/reminder.dto';
import { Elderly } from '../entities/elderly.entity';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
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

  // Criar novo lembrete
  async create(createReminderDto: CreateReminderDto, caregiverId: string): Promise<Reminder> {
    // Verificar se o idoso pertence ao cuidador
    await this.validateElderlyOwnership(createReminderDto.elderlyId, caregiverId);

    const reminder = this.reminderRepository.create(createReminderDto);
    return this.reminderRepository.save(reminder);
  }

  // Buscar todos os lembretes de um idoso
  async findAllByElderly(elderlyId: string, caregiverId: string): Promise<Reminder[]> {
    // Verificar se o idoso pertence ao cuidador
    await this.validateElderlyOwnership(elderlyId, caregiverId);

    return this.reminderRepository.find({
      where: { elderlyId },
      order: { datetime: 'ASC' },
    });
  }

  // Buscar um lembrete específico
  async findOne(id: string, caregiverId: string): Promise<Reminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id },
      relations: ['elderly'],
    });

    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado');
    }

    // Verificar se o idoso pertence ao cuidador
    await this.validateElderlyOwnership(reminder.elderlyId, caregiverId);

    return reminder;
  }

  // Atualizar um lembrete
  async update(id: string, updateReminderDto: UpdateReminderDto, caregiverId: string): Promise<Reminder> {
    const reminder = await this.findOne(id, caregiverId);
    
    Object.assign(reminder, updateReminderDto);
    return this.reminderRepository.save(reminder);
  }

  // Remover um lembrete
  async remove(id: string, caregiverId: string): Promise<void> {
    const reminder = await this.findOne(id, caregiverId);
    
    await this.reminderRepository.remove(reminder);
  }
}
