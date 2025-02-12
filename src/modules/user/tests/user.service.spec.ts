import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { AdminConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

import { AwsCognitoService } from '../aws-cognito.service';
import { User } from '../entities/user.entity';
import { USER_REPOSITORY } from '../providers/user.provider';
import { UserService } from '../user.service';
import { Role } from '../enums/user-role.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let awsCognitoService: AwsCognitoService;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAwsCognitoService = {
    signupUser: jest.fn(),
    confirmSignUp: jest.fn(),
    signinUser: jest.fn(),
    logout: jest.fn(),
    cognitoIdentityProvider: {
      send: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: AwsCognitoService,
          useValue: mockAwsCognitoService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY);
    awsCognitoService = module.get<AwsCognitoService>(AwsCognitoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto = {
      firstName: 'Test',
      lastName: 'User',
      dob: new Date('1990-01-01'),
      email: 'test@example.com',
      password: 'Password123!',
      address: '123 Test St',
      country: 'TestLand',
      role: Role.CLIENT,
    };

    it('should successfully signup a new user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockAwsCognitoService.signupUser.mockResolvedValue({});
      mockAwsCognitoService.confirmSignUp.mockResolvedValue({});
      mockUserRepository.save.mockResolvedValue(signupDto);

      const result = await service.signup(signupDto);

      expect(result).toEqual(signupDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: signupDto.email },
      });
      expect(mockAwsCognitoService.signupUser).toHaveBeenCalledWith({
        email: signupDto.email,
        password: signupDto.password,
        role: signupDto.role,
      });
      expect(mockAwsCognitoService.confirmSignUp).toHaveBeenCalledWith(signupDto.email);
      expect(mockUserRepository.save).toHaveBeenCalledWith(signupDto);
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(signupDto);

      await expect(service.signup(signupDto)).rejects.toThrow(
        new ConflictException(`User #${signupDto.email} already exists`),
      );
    });

    it('should throw BadRequestException if signup fails', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockAwsCognitoService.signupUser.mockRejectedValue(new Error('Signup failed'));

      await expect(service.signup(signupDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if confirmation fails', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockAwsCognitoService.signupUser.mockResolvedValue({});
      mockAwsCognitoService.confirmSignUp.mockRejectedValue(new Error('Confirmation failed'));

      await expect(service.signup(signupDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('signin', () => {
    const signinDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    const mockCognitoResponse = {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
      idToken: 'mockIdToken',
    };

    it('should successfully signin a user', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: '1',
        email: signinDto.email,
      });
      mockAwsCognitoService.signinUser.mockResolvedValue(mockCognitoResponse);

      const result = await service.signin(signinDto);

      expect(result).toEqual({ cognitoResponse: mockCognitoResponse });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: signinDto.email },
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: '1',
        email: signinDto.email,
      });
      mockAwsCognitoService.signinUser.mockRejectedValue(new Error('Invalid credentials'));

      await expect(service.signin(signinDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: '1', email: 'test@example.com' }];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne({ id: '1' });

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne({ id: '1' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = {
      firstName: 'Updated',
      lastName: 'Name',
      address: 'New Address',
    };

    it('should update a user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Original',
        lastName: 'User',
        address: 'Old Address',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update('1', updateDto);

      expect(result).toEqual({ affected: 1 });
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(result).toEqual(mockUser);
    });
  });

  describe('recoverPassword', () => {
    const recoverPasswordDto = {
      email: 'test@example.com',
    };

    it('should initiate password recovery', async () => {
      const mockUser = {
        id: '1',
        email: recoverPasswordDto.email,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.recoverPassword(recoverPasswordDto);

      expect(result).toEqual({ message: 'Recovery email sent' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: recoverPasswordDto.email },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.recoverPassword(recoverPasswordDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      mockAwsCognitoService.logout.mockResolvedValue(undefined);

      await service.logout();

      expect(mockAwsCognitoService.logout).toHaveBeenCalled();
    });
  });
});
