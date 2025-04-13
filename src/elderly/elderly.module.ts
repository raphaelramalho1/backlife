import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElderlyController } from './elderly.controller';
import { ElderlyService } from './elderly.service';
import { Elderly } from '../entities/elderly.entity';
import { Caregiver } from '../entities/caregiver.entity';
import { ActionLog } from '../entities/action-log.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Elderly, Caregiver, ActionLog]),
    AuthModule,
  ],
  controllers: [ElderlyController],
  providers: [ElderlyService],
  exports: [ElderlyService],
})
export class ElderlyModule {}
