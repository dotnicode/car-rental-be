import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDateString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Role } from '../enums/user-role.enum';

export class SignUpUserDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  country: string;

  @IsEnum(Role, {
    message: 'Role must be one of the following values: client, admin',
  })
  role: Role;
}
