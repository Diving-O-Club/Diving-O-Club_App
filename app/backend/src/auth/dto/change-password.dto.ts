import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

/** Payload submitted to `PATCH /auth/me/password`. */
export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass1!', description: 'Current password.' })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    example: 'NewPass1!',
    description: 'New password; same strength rules as registration.',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: 'Le mot de passe ne respecte pas les critères requis',
  })
  newPassword: string;
}
