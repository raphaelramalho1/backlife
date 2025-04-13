import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Caregiver } from '../entities/caregiver.entity';
import { CreateCaregiverDto, LoginCaregiverDto } from '../dto/caregiver.dto';
import { Role } from '../auth/roles.guard';

@Injectable()
export class CaregiverService {
  constructor(
    @InjectRepository(Caregiver)
    private caregiverRepository: Repository<Caregiver>,
    private jwtService: JwtService,
  ) {}

  async create(createCaregiverDto: CreateCaregiverDto): Promise<{ accessToken: string }> {
    const { name, email, password } = createCaregiverDto;
    
    // Verificar se o e-mail já está em uso
    const existingCaregiver = await this.caregiverRepository.findOne({ where: { email } });
    if (existingCaregiver) {
      throw new ConflictException('E-mail já cadastrado');
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo cuidador
    const caregiver = this.caregiverRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.caregiverRepository.save(caregiver);

    // Gerar token JWT
    const accessToken = this.jwtService.sign({
      id: caregiver.id,
      email: caregiver.email,
      role: Role.CAREGIVER,
    });

    return { accessToken };
  }

  async login(loginCaregiverDto: LoginCaregiverDto): Promise<{ accessToken: string }> {
    const { email, password } = loginCaregiverDto;

    // Buscar cuidador pelo e-mail
    const caregiver = await this.caregiverRepository.findOne({ where: { email } });
    if (!caregiver) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, caregiver.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar token JWT
    const accessToken = this.jwtService.sign({
      id: caregiver.id,
      email: caregiver.email,
      role: Role.CAREGIVER,
    });

    return { accessToken };
  }
}
