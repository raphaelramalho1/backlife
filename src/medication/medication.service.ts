import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from '../entities/medication.entity';
import { CreateMedicationDto, UpdateMedicationDto } from '../dto/medication.dto';
import { Elderly } from '../entities/elderly.entity';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
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

  // Criar novo medicamento
  async create(createMedicationDto: CreateMedicationDto, caregiverId: string): Promise<Medication> {
    // Verificar se o idoso pertence ao cuidador
    await this.validateElderlyOwnership(createMedicationDto.elderlyId, caregiverId);

    const medication = this.medicationRepository.create(createMedicationDto);
    return this.medicationRepository.save(medication);
  }

  // Buscar todos os medicamentos de um idoso
  async findAllByElderly(elderlyId: string, caregiverId: string): Promise<Medication[]> {
    // Verificar se o idoso pertence ao cuidador
    await this.validateElderlyOwnership(elderlyId, caregiverId);

    return this.medicationRepository.find({
      where: { elderlyId },
      order: { name: 'ASC' },
    });
  }

  // Buscar um medicamento específico
  async findOne(id: string, caregiverId: string): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { id },
      relations: ['elderly'],
    });

    if (!medication) {
      throw new NotFoundException('Medicamento não encontrado');
    }

    // Verificar se o idoso pertence ao cuidador
    await this.validateElderlyOwnership(medication.elderlyId, caregiverId);

    return medication;
  }

  // Atualizar um medicamento
  async update(id: string, updateMedicationDto: UpdateMedicationDto, caregiverId: string): Promise<Medication> {
    const medication = await this.findOne(id, caregiverId);
    
    Object.assign(medication, updateMedicationDto);
    return this.medicationRepository.save(medication);
  }

  // Remover um medicamento
  async remove(id: string, caregiverId: string): Promise<void> {
    const medication = await this.findOne(id, caregiverId);
    
    await this.medicationRepository.remove(medication);
  }
}
