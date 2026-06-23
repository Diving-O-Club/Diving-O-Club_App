import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { DivingLevel, InstructorLevel } from '../../user/user.enums';

/** Editable profile fields submitted to `PUT /auth/me`. */
export class UpdateUserDto {
  @ApiProperty({ example: 'Marc', description: 'First name.' })
  @IsString()
  @Length(1, 100)
  firstName: string;

  @ApiProperty({ example: 'Dupont', description: 'Last name.' })
  @IsString()
  @Length(1, 100)
  lastName: string;

  @ApiProperty({
    example: 'marc.dupont@example.com',
    description: 'Email address.',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '+33 6 12 34 56 78',
    nullable: true,
    description: 'Phone number (10–20 characters).',
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone: string | null;

  @ApiPropertyOptional({
    example: '1990-05-12',
    nullable: true,
    description: 'Birth date as an ISO date string.',
  })
  @IsOptional()
  @IsString()
  birthDate: string | null;

  @ApiPropertyOptional({
    example: '12 Avenue du Lac',
    nullable: true,
    description: 'Street address.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  street: string | null;

  @ApiPropertyOptional({
    example: '13008',
    nullable: true,
    description: '5-digit postal code.',
  })
  @IsOptional()
  @Matches(/^\d{5}$/, { message: 'Format invalide (ex : 13008)' })
  postalCode: string | null;

  @ApiPropertyOptional({
    example: 'Marseille',
    nullable: true,
    description: 'City.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  city: string | null;

  @ApiPropertyOptional({
    example: 'A-13-000001',
    nullable: true,
    description: 'FFESSM license number, format A-01-000001.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]-\d{2}-\d{6}$/i, {
    message: 'Format invalide (ex : A-01-000001)',
  })
  ffessmLicenseNumber: string | null;

  @ApiPropertyOptional({
    enum: DivingLevel,
    nullable: true,
    description: 'Diver certification level.',
  })
  @IsOptional()
  @IsEnum(DivingLevel)
  divingLevel: DivingLevel | null;

  @ApiPropertyOptional({
    enum: InstructorLevel,
    nullable: true,
    description: 'Instructor certification level.',
  })
  @IsOptional()
  @IsEnum(InstructorLevel)
  instructorLevel: InstructorLevel | null;
}
