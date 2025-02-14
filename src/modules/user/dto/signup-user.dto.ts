import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

import { Role } from 'src/common/enums/role.enum';

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
