import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsDateString()
  datetime: string;

  @IsOptional()
  @IsBoolean()
  isRecurring: boolean;

  @IsOptional()
  @IsString()
  recurrencePattern: string;

  @IsNotEmpty()
  @IsUUID()
  elderlyId: string;
}

export class UpdateReminderDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsDateString()
  datetime?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurrencePattern?: string;
}

export class ReminderResponseDto {
  id: string;
  message: string;
  datetime: Date;
  isRecurring: boolean;
  recurrencePattern: string;
  elderlyId: string;
  createdAt: Date;
  updatedAt: Date;
}
