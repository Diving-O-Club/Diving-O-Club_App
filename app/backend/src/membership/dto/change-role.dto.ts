import { IsIn, IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsString()
  @IsIn(['admin', 'committee', 'instructor', 'member'])
  codeRole: string;
}
