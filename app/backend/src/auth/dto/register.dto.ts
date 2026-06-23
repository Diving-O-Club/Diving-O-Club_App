import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

/** Payload submitted to `POST /auth/register`. */
export class RegisterDto {
  @ApiProperty({ example: 'Marc', description: 'First name.' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont', description: 'Last name.' })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'marc.dupont@example.com',
    description: 'Email address; must be unique.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Str0ng!Pass',
    description:
      'At least 8 characters with an upper case, a lower case, a digit and a special character.',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
  })
  password: string;
}
