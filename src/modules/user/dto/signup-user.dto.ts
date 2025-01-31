import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDateString,
  MinLength,
  IsOptional,
  Matches,
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

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
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
