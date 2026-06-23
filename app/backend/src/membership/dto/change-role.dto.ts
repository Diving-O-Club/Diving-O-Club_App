import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

/** Payload submitted to `PATCH /members/:id/role`. */
export class ChangeRoleDto {
  @ApiProperty({
    example: 'instructor',
    enum: ['admin', 'committee', 'instructor', 'member'],
    description: 'New role code to assign (super_admin is not assignable).',
  })
  @IsString()
  @IsIn(['admin', 'committee', 'instructor', 'member'])
  codeRole: string;
}
