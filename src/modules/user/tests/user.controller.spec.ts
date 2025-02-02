import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { SignUpUserDto } from '../dto/signup-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RecoverUserPasswordDto } from '../dto/recover-password.dto';
import { Role } from '../enums/user-role.enum';
import { User } from '../entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, { provide: 'USER_REPOSITORY', useValue: {} }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should signup a new user', async () => {
      const createUserDto: SignUpUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        dob: new Date('1990-01-01'),
        role: Role.CLIENT,
        address: '123 Main St',
        country: 'USA',
      };

      const expectedResult: User = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'signup').mockResolvedValue(expectedResult);

      expect(await controller.signup(createUserDto)).toBe(expectedResult);
    });
  });

  describe('recoverPassword', () => {
    it('should initiate password recovery', async () => {
      const recoverPasswordDto: RecoverUserPasswordDto = {
        email: 'test@example.com',
      };
      const expectedResult = { message: 'Recovery email sent' };

      jest.spyOn(service, 'recoverPassword').mockResolvedValue(expectedResult);

      expect(await controller.recoverPassword(recoverPasswordDto)).toBe(expectedResult);
      expect(service.recoverPassword).toHaveBeenCalledWith(recoverPasswordDto);
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const expectedResult = { message: 'Logout successful' };

      jest.spyOn(service, 'logout').mockResolvedValue(expectedResult);

      expect(await controller.logout()).toBe(expectedResult);
      expect(service.logout).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user details', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
      };

      const expectedResult: User = {
        id: 1,
        firstName: updateUserDto.firstName!,
        lastName: updateUserDto.lastName!,
        email: updateUserDto.email!,
        password: '',
        dob: new Date('1990-01-01'),
        role: Role.CLIENT,
        address: '123 Main St',
        country: 'USA',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update(1, updateUserDto)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });
});
