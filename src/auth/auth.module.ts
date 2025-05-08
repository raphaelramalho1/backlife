import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caregiver } from '../entities/caregiver.entity';
import { Elderly } from '../entities/elderly.entity';
import { Medication } from '../entities/medication.entity';
import { Reminder } from '../entities/reminder.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { ElderlyOwnerGuard } from './elderly-owner.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Caregiver, Elderly, Medication, Reminder]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'lifecaresecret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    ElderlyOwnerGuard,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
  exports: [JwtStrategy, PassportModule, JwtModule, AuthService, ElderlyOwnerGuard],
})
export class AuthModule {}
