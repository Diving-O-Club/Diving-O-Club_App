import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

/** Credentials submitted to `POST /auth/login`. */
export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Account email address.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Str0ng!Pass', description: 'Account password.' })
  @IsString()
  password: string;
}
