import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { DivingLevel, InstructorLevel } from '../../app-user/app-user.enums';

export class UpdateUserDto {
  @IsString()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @Length(1, 100)
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone: string | null;

  @IsOptional()
  @IsString()
  birthDate: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  street: string | null;

  @IsOptional()
  @Matches(/^\d{5}$/, { message: 'Format invalide (ex : 13008)' })
  postalCode: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  city: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]-\d{2}-\d{6}$/i, {
    message: 'Format invalide (ex : A-01-000001)',
  })
  ffessmLicenseNumber: string | null;

  @IsOptional()
  @IsEnum(DivingLevel)
  divingLevel: DivingLevel | null;

  @IsOptional()
  @IsEnum(InstructorLevel)
  instructorLevel: InstructorLevel | null;
}
