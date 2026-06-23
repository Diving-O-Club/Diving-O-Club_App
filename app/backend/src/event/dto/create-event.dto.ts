import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { EventType, MinimumLevel } from '../event.enums';

/** Payload submitted to `POST /clubs/:clubId/events`. */
export class CreateEventDto {
  @ApiProperty({ example: 'Sortie lac de Nantua', description: 'Event title.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({ description: 'Free-text description.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: EventType,
    example: EventType.DIVE_TRIP,
    description: 'Event type.',
  })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty({
    example: '2026-07-01T10:00:00.000Z',
    description: 'Start datetime (ISO 8601).',
  })
  @IsDateString()
  startDatetime: string;

  @ApiProperty({
    example: '2026-07-01T12:00:00.000Z',
    description: 'End datetime (ISO 8601).',
  })
  @IsDateString()
  endDatetime: string;

  @ApiPropertyOptional({ example: 'Lac de Nantua', description: 'Location.' })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  location?: string;

  @ApiPropertyOptional({
    enum: MinimumLevel,
    description: 'Minimum required level ("all" means no minimum).',
  })
  @IsString()
  @IsOptional()
  minimumLevel?: string;

  @ApiPropertyOptional({
    example: 12,
    description: 'Maximum capacity; omit for unlimited (no waitlist).',
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  maxCapacity?: number;

  @ApiProperty({ example: false, description: 'Whether the event is paid.' })
  @IsBoolean()
  isPaid: boolean;

  @ApiPropertyOptional({
    example: 35,
    description: 'Price in euros (required when isPaid is true).',
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;
}
