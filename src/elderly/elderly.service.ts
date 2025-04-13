import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Elderly } from '../entities/elderly.entity';
import { Caregiver } from '../entities/caregiver.entity';
import { ActionLog } from '../entities/action-log.entity';
import { CreateElderlyDto, UpdateElderlyDto, ValidatePinDto, ActionConfirmationDto } from '../dto/elderly.dto';
import { Role } from '../auth/roles.guard';

@Injectable()
export class ElderlyService {
  constructor(
    @InjectRepository(Elderly)
    private elderlyRepository: Repository<Elderly>,
    @InjectRepository(Caregiver)
    private caregiverRepository: Repository<Caregiver>,
    @InjectRepository(ActionLog)
    private actionLogRepository: Repository<ActionLog>,
    private jwtService: JwtService,
  ) {}

  // Generate a random PIN
  private generatePin(): string {
    // Generate a 4-digit PIN
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Create a new elderly profile
  async create(createElderlyDto: CreateElderlyDto, caregiverId: string): Promise<Elderly> {
    const caregiver = await this.caregiverRepository.findOne({ where: { id: caregiverId } });
    if (!caregiver) {
      throw new UnauthorizedException('Cuidador não encontrado');
    }

    // Generate a unique PIN
    let pin = this.generatePin();
    let pinExists = await this.elderlyRepository.findOne({ where: { pin } });
    
    // Ensure PIN is unique
    while (pinExists) {
      pin = this.generatePin();
      pinExists = await this.elderlyRepository.findOne({ where: { pin } });
    }

    const elderly = this.elderlyRepository.create({
      ...createElderlyDto,
      pin,
      caregiver,
    });

    return this.elderlyRepository.save(elderly);
  }

  // Get all elderly profiles for a caregiver
  async findAllForCaregiver(caregiverId: string): Promise<Elderly[]> {
    return this.elderlyRepository.find({
      where: { caregiver: { id: caregiverId } },
      relations: ['caregiver'],
    });
  }

  // Get one elderly by ID
  async findOne(id: string, caregiverId: string): Promise<Elderly> {
    const elderly = await this.elderlyRepository.findOne({
      where: { id, caregiver: { id: caregiverId } },
      relations: ['caregiver'],
    });

    if (!elderly) {
      throw new NotFoundException(`Idoso com ID ${id} não encontrado`);
    }

    return elderly;
  }

  // Update an elderly profile
  async update(id: string, updateElderlyDto: UpdateElderlyDto, caregiverId: string): Promise<Elderly> {
    const elderly = await this.findOne(id, caregiverId);
    
    const updatedElderly = this.elderlyRepository.merge(elderly, updateElderlyDto);
    
    return this.elderlyRepository.save(updatedElderly);
  }

  // Delete an elderly profile
  async remove(id: string, caregiverId: string): Promise<void> {
    const elderly = await this.findOne(id, caregiverId);
    
    await this.elderlyRepository.remove(elderly);
  }

  // Validate PIN and return JWT token
  async validatePin(validatePinDto: ValidatePinDto): Promise<{ accessToken: string }> {
    const { pin } = validatePinDto;
    
    const elderly = await this.elderlyRepository.findOne({
      where: { pin },
      relations: ['caregiver'],
    });

    if (!elderly) {
      throw new UnauthorizedException('PIN inválido');
    }

    // Gerar token JWT
    const accessToken = this.jwtService.sign({
      id: elderly.id,
      role: Role.ELDERLY,
    });

    return { accessToken };
  }

  // Log an action for an elderly
  async logAction(actionConfirmationDto: ActionConfirmationDto): Promise<ActionLog> {
    const { actionType, description, elderlyId } = actionConfirmationDto;
    
    const elderly = await this.elderlyRepository.findOne({ where: { id: elderlyId } });
    if (!elderly) {
      throw new NotFoundException(`Idoso com ID ${elderlyId} não encontrado`);
    }

    const actionLog = this.actionLogRepository.create({
      actionType,
      description,
      elderly,
    });

    return this.actionLogRepository.save(actionLog);
  }

  // Get action logs for an elderly
  async getActionLogs(elderlyId: string, caregiverId: string): Promise<ActionLog[]> {
    // First check if the elderly belongs to this caregiver
    await this.findOne(elderlyId, caregiverId);
    
    return this.actionLogRepository.find({
      where: { elderly: { id: elderlyId } },
      relations: ['elderly'],
      order: { timestamp: 'DESC' },
    });
  }
}
