import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateElderlyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  medicalInfo?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;
}

export class UpdateElderlyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  medicalInfo?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;
}

export class ValidatePinDto {
  @IsNotEmpty()
  @IsString()
  pin: string;
}

export class ElderlyResponseDto {
  id: string;
  name: string;
  birthDate: Date;
  photo: string;
  medicalInfo: string;
  contactInfo: string;
  pin: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ActionConfirmationDto {
  @IsNotEmpty()
  @IsString()
  actionType: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  elderlyId: string;
}
