import { IsNotEmpty, IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateMedicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  times: string[]; // Array de horários

  @IsOptional()
  @IsString()
  dosage: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsNotEmpty()
  @IsUUID()
  elderlyId: string;
}

export class UpdateMedicationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  times?: string[];

  @IsOptional()
  @IsString()
  dosage?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class MedicationResponseDto {
  id: string;
  name: string;
  times: string[];
  dosage: string;
  notes: string;
  elderlyId: string;
  createdAt: Date;
  updatedAt: Date;
}
