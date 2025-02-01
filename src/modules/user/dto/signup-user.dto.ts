import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDateString,
  MinLength,
  IsOptional,
  Matches,
  isStrongPassword,
  IsStrongPassword,
  IsDate,
} from 'class-validator';
import { Role } from '../enums/user-role.enum';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

export class SignUpUserDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dob: Date;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
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
