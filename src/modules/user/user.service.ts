import { Repository, UpdateResult } from 'typeorm';

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AwsCognitoService } from './aws-cognito.service';
import { RecoverUserPasswordDto } from './dto/recover-password.dto';
import { SignInUserDto } from './dto/signin-user-dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from './providers/user.provider';
import { Role } from './enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    private readonly awsCognitoService: AwsCognitoService,
  ) { }

  async signup(signupUserDto: SignUpUserDto) {
    const { email, password, role } = signupUserDto;

    try {
      const isUserExists = await this.userRepository.findOne({ where: { email } });
      if (isUserExists) throw new ConflictException(`User #${email} already exists`);

      await this.awsCognitoService.signupUser({ email, password, role });
      await this.awsCognitoService.confirmSignUp(email);
      await this.awsCognitoService.addUserToGroup(email, role);

      return await this.userRepository.save(signupUserDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'An unexpected error occurred');
    }
  }

  async signin(signInDto: SignInUserDto) {
    await this.findOne({ email: signInDto.email });

    try {
      const cognitoResponse = await this.awsCognitoService.signinUser(signInDto);
      return { cognitoResponse };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid credentials');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne({ id, email }: { id?: string; email?: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, email },
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    await this.findOne({ id });

    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne({ id });
    await this.userRepository.remove(user);

    return { ...user, id };
  }

  async recoverPassword(recoverPasswordDto: RecoverUserPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: recoverPasswordDto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.awsCognitoService.recoverPassword(recoverPasswordDto);

    return { message: 'Password updated successfully' };
  }

  async logout() {
    return this.awsCognitoService.logout();
  }
}
