import { IsNotEmpty, IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  specialty: string;

  @IsNotEmpty()
  @IsDateString()
  datetime: string;

  @IsNotEmpty()
  @IsString()
  locationOrLink: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsNotEmpty()
  @IsUUID()
  elderlyId: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsDateString()
  datetime?: string;

  @IsOptional()
  @IsString()
  locationOrLink?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AppointmentResponseDto {
  id: string;
  specialty: string;
  datetime: Date;
  locationOrLink: string;
  notes: string;
  elderlyId: string;
  createdAt: Date;
  updatedAt: Date;
}
