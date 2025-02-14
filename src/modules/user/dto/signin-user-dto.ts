import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
