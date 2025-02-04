import { Repository } from 'typeorm';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { SignUpUserDto } from '../dto/signup-user.dto';
import { User } from '../entities/user.entity';
import { Role } from '../enums/user-role.enum';
import { USER_REPOSITORY } from '../providers/user.provider';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(USER_REPOSITORY);
  });

  describe('signup', () => {
    it('should signup a new client user successfully', async () => {
      const createUserDto: SignUpUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        dob: new Date('1990-01-01'),
        address: '123 Main St',
        country: 'USA',
        role: Role.CLIENT,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createUserDto);
      mockUserRepository.save.mockResolvedValue({ id: 1, ...createUserDto });

      const result = await service.signup(createUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        password: 'password123',
      } as SignUpUserDto;

      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'existing@example.com',
      });

      await expect(service.signup(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update user details successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        address: 'New Address',
      };

      const existingUser = {
        id: 1,
        ...updateData,
        role: Role.CLIENT,
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(existingUser);

      const result = await service.update(1, updateData);

      expect(result).toBeDefined();
      expect(result.firstName).toBe(updateData.firstName);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { firstName: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, email: 'test@example.com' };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const user = { id: 1, email: 'test@example.com' };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.remove.mockResolvedValue(user);

      const result = await service.remove(1);

      expect(result).toEqual(user);
      expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException when trying to remove non-existent user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('recoverPassword', () => {
    it('should initiate password recovery process', async () => {
      const recoverPasswordDto = { email: 'test@example.com' };
      const expectedResult = { message: 'Recovery email sent' };

      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      });

      const result = await service.recoverPassword(recoverPasswordDto);

      expect(result).toEqual(expectedResult);
    });

    it('should handle non-existent email for password recovery', async () => {
      const recoverPasswordDto = { email: 'nonexistent@example.com' };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.recoverPassword(recoverPasswordDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const expectedResult = { message: 'Logout successful' };
      const result = await service.logout();

      expect(result).toEqual(expectedResult);
    });
  });
});
