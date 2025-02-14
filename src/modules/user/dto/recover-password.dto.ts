import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class RecoverUserPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  currentPassword: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;
}
