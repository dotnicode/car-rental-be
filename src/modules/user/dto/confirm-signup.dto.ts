import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmSignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
