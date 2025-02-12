import { Test, TestingModule } from '@nestjs/testing';
import { AwsCognitoService } from '../aws-cognito.service';
import { RecoverUserPasswordDto } from '../dto/recover-password.dto';
import { SignInUserDto } from '../dto/signin-user-dto';
import { SignUpUserDto } from '../dto/signup-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from '../enums/user-role.enum';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    signup: jest.fn(),
    signin: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    recoverPassword: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: 'USER_REPOSITORY',
          useValue: {},
        },
        {
          provide: AwsCognitoService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should signup a new user', async () => {
      const signupDto: SignUpUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dob: new Date('1990-01-01'),
        role: Role.CLIENT,
        address: '123 Main St',
        country: 'USA',
      };

      const expectedResult = {
        ...signupDto,
      };

      mockUserService.signup.mockResolvedValue(expectedResult);

      const result = await controller.signup(signupDto);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.signup).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('signin', () => {
    it('should signin a user', async () => {
      const signinDto: SignInUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const expectedResponse = {
        cognitoResponse: {
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
          idToken: 'mockIdToken',
        },
      };

      mockUserService.signin.mockResolvedValue(expectedResponse);

      const result = await controller.signin(signinDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUserService.signin).toHaveBeenCalledWith(signinDto);
    });
  });

  describe('recoverPassword', () => {
    it('should initiate password recovery', async () => {
      const recoverPasswordDto: RecoverUserPasswordDto = {
        email: 'test@example.com',
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
      };

      const expectedResult = { message: 'Password updated successfully' };

      mockUserService.recoverPassword.mockResolvedValue(expectedResult);

      const result = await controller.recoverPassword(recoverPasswordDto);

      expect(result).toBe(expectedResult);
      expect(mockUserService.recoverPassword).toHaveBeenCalledWith(recoverPasswordDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: '1', email: 'test@example.com' }];
      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('update', () => {
    it('should update user details', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        address: 'New Address',
      };

      const expectedResult = { affected: 1 };

      mockUserService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateUserDto);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockUserService.remove.mockResolvedValue(mockUser);

      const result = await controller.remove('1');

      expect(result).toEqual(mockUser);
      expect(mockUserService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      mockUserService.logout.mockResolvedValue(undefined);

      await controller.logout();

      expect(mockUserService.logout).toHaveBeenCalled();
    });
  });
});
