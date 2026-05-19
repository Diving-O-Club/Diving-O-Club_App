import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsDateString()
  startDatetime: string;

  @IsDateString()
  endDatetime: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  location?: string;

  @IsString()
  @IsOptional()
  minimumLevel?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  maxCapacity?: number;

  @IsBoolean()
  isPaid: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;
}