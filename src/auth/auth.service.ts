import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caregiver } from '../entities/caregiver.entity';
import { CreateCaregiverDto, LoginCaregiverDto, CaregiverResponseDto } from '../dto/caregiver.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './roles.guard';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Caregiver)
    private caregiverRepository: Repository<Caregiver>,
    private jwtService: JwtService,
  ) {}

  async register(createCaregiverDto: CreateCaregiverDto): Promise<{ access_token: string, user: CaregiverResponseDto }> {
    const { name, email, password } = createCaregiverDto;
    
    // Check if user already exists
    const existingUser = await this.caregiverRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new caregiver
    const caregiver = this.caregiverRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    
    await this.caregiverRepository.save(caregiver);
    
    // Generate JWT token
    const token = this.jwtService.sign({ 
      id: caregiver.id, 
      email: caregiver.email,
      role: Role.CAREGIVER 
    });
    
    // Return user data without password
    const userResponse: CaregiverResponseDto = {
      id: caregiver.id,
      name: caregiver.name,
      email: caregiver.email,
      createdAt: caregiver.createdAt,
      updatedAt: caregiver.updatedAt
    };
    
    return { 
      access_token: token,
      user: userResponse
    };
  }

  async login(loginCaregiverDto: LoginCaregiverDto): Promise<{ access_token: string, user: CaregiverResponseDto }> {
    const { email, password } = loginCaregiverDto;
    
    // Find caregiver by email
    const caregiver = await this.caregiverRepository.findOne({ where: { email } });
    if (!caregiver) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, caregiver.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate JWT token
    const token = this.jwtService.sign({ 
      id: caregiver.id, 
      email: caregiver.email,
      role: Role.CAREGIVER 
    });
    
    // Return user data without password
    const userResponse: CaregiverResponseDto = {
      id: caregiver.id,
      name: caregiver.name,
      email: caregiver.email,
      createdAt: caregiver.createdAt,
      updatedAt: caregiver.updatedAt
    };
    
    return { 
      access_token: token,
      user: userResponse
    };
  }

  async validateUser(id: string): Promise<Caregiver> {
    const caregiver = await this.caregiverRepository.findOne({ where: { id } });
    if (!caregiver) {
      throw new UnauthorizedException('User not found');
    }
    return caregiver;
  }
}
