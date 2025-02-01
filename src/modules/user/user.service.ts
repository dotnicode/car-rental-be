import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from './providers/user.provider';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignInUserDto } from './dto/signin-user-dto';
import { RecoverUserPasswordDto } from './dto/recover-user-password.dto';
import { AwsCognitoService } from './aws-cognito.service';
import SignupResponse from './types/SignupResponse.type';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    private readonly awsCognitoService: AwsCognitoService,
  ) {}

  async signup(signupUserDto: SignUpUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: signupUserDto.email },
      });
      if (existingUser) throw new ConflictException('User already exists');

      const cognitoResponse =
        await this.awsCognitoService.signupUser(signupUserDto);
      const user = await this.userRepository.save(signupUserDto);

      return { user, cognitoUser: cognitoResponse };
    } catch (error) {
      return {
        error: true,
        message: error.message || 'An unexpected error occurred',
        cognitoUser: null,
        user: null,
      };
    }
  }

  async signin(signInDto: SignInUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: signInDto.email, password: signInDto.password },
    });
    if (!user) throw new Error('User not found');

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    await this.userRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);

    return { ...user, id };
  }

  async recoverPassword(recoverPasswordDto: RecoverUserPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: recoverPasswordDto.email },
    });
    if (!user) throw new NotFoundException('User not found');

    return { message: 'Recovery email sent' };
  }

  async logout() {
    return Promise.resolve({ message: 'Logout successful' });
  }
}
