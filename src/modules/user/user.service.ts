import { Repository, UpdateResult } from 'typeorm';

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AwsCognitoService } from '../utils/aws-cognito.service';
import { RecoverUserPasswordDto } from './dto/recover-password.dto';
import { SignInUserDto } from './dto/signin-user-dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from './providers/user.provider';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    private readonly awsCognitoService: AwsCognitoService,
  ) {}

  async signup(signupUserDto: SignUpUserDto) {
    const { email, password, role } = signupUserDto;

    try {
      const isUserExists = await this.userRepository.findOne({ where: { email } });
      if (isUserExists) throw new ConflictException(`User ${email.split('@')[0]} already exists`);

      await this.awsCognitoService.signupUser({ email, password, role });
      await this.awsCognitoService.confirmSignUp(email);

      return await this.userRepository.save(signupUserDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'An unexpected error occurred');
    }
  }

  async signin(signInDto: SignInUserDto) {
    await this.findOne({ email: signInDto.email });

    try {
      return await this.awsCognitoService.signinUser(signInDto);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid credentials');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['documents'] });
  }

  async findOne({ id, email }: { id?: string; email?: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, email },
      relations: ['documents'],
    });
    if (!user) throw new BadRequestException(`User #${id} not found`);

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

    this.awsCognitoService.recoverPassword(recoverPasswordDto);

    return { message: 'Password updated successfully' };
  }

  async logout() {
    return this.awsCognitoService.logout();
  }
}
