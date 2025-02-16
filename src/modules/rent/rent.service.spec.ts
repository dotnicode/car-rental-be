import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { RentService } from './rent.service';
import { CarService } from '../car/car.service';
import { UserService } from '../user/user.service';
import { RENT_REPOSITORY } from './providers/rent.provider';
import { CreateRentDto } from './dto/create-rent.dto';
import { Rent } from './entities/rent.entity';
import { BadRequestException } from '@nestjs/common';

describe('RentService', () => {
  let service: RentService;
  let rentRepository: Repository<Rent>;
  let carService: CarService;
  let userService: UserService;

  const mockRentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCarService = {
    findOne: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentService,
        {
          provide: RENT_REPOSITORY,
          useValue: mockRentRepository,
        },
        {
          provide: CarService,
          useValue: mockCarService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<RentService>(RentService);
    rentRepository = module.get<Repository<Rent>>(RENT_REPOSITORY);
    carService = module.get<CarService>(CarService);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(rentRepository).toBeDefined();
    expect(carService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new rent', async () => {
      const createRentDto: CreateRentDto = {
        carId: 'car-uuid',
        userId: 'user-uuid',
        adminId: 'admin-uuid',
        pricePerDay: 50,
        acceptedDate: new Date(),
        rejected: false,
        dueDate: new Date(),
        startingDate: new Date(),
        endingDate: new Date(),
      };

      const rentToSave = {
        car: { id: createRentDto.carId },
        user: { id: createRentDto.userId },
        admin: { id: createRentDto.adminId },
        pricePerDay: createRentDto.pricePerDay,
        acceptedDate: createRentDto.acceptedDate,
        rejected: createRentDto.rejected,
        dueDate: createRentDto.dueDate,
        startingDate: createRentDto.startingDate,
        endingDate: createRentDto.endingDate,
      };

      const expectedResult = {
        ...rentToSave,
        id: 'rent-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCarService.findOne.mockResolvedValue(createRentDto.carId);
      mockUserService.findOne.mockResolvedValue(createRentDto.userId);
      mockRentRepository.save.mockResolvedValue(expectedResult);

      const result = await service.create(createRentDto);

      expect(result).toEqual(expectedResult);
      expect(mockRentRepository.save).toHaveBeenCalledWith(rentToSave);
    });

    it('should throw BadRequestException if car is not found', async () => {
      const createRentDto: CreateRentDto = {
        carId: 'non-existent-id',
        userId: 'user-uuid',
        adminId: 'admin-uuid',
        pricePerDay: 50,
        dueDate: new Date(),
        startingDate: new Date(),
        endingDate: new Date(),
      };

      mockCarService.findOne.mockRejectedValue(new BadRequestException('Car not found'));

      await expect(service.create(createRentDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user is not found', async () => {
      const createRentDto: CreateRentDto = {
        carId: 'car-uuid',
        userId: 'non-existent-id',
        adminId: 'admin-uuid',
        pricePerDay: 50,
        dueDate: new Date(),
        startingDate: new Date(),
        endingDate: new Date(),
      };

      mockUserService.findOne.mockRejectedValue(new BadRequestException('User not found'));

      await expect(service.create(createRentDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw badrequestexception if admin is not found', async () => {
      const createRentDto: CreateRentDto = {
        carId: 'car-uuid',
        userId: 'user-uuid',
        adminId: 'non-existent-id',
        pricePerDay: 50,
        dueDate: new Date(),
        startingDate: new Date(),
        endingDate: new Date(),
      };

      mockUserService.findOne.mockRejectedValue(new BadRequestException('Admin not found'));

      await expect(service.create(createRentDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of rents', async () => {
      const rents = [new Rent(), new Rent()];
      mockRentRepository.find.mockResolvedValue(rents);

      const result = await service.findAll();
      expect(result).toEqual(rents);
      expect(mockRentRepository.find).toHaveBeenCalledWith({
        relations: { car: true, user: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a rent by ID', async () => {
      const rent = new Rent();
      mockRentRepository.findOne.mockResolvedValue(rent);

      const result = await service.findOne('rent-uuid');
      expect(result).toEqual(rent);
    });

    it('should throw BadRequestException if rent is not found', async () => {
      mockRentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a rent', async () => {
      const updateRentDto = {
        pricePerDay: 60,
        rejected: true,
      };

      mockRentRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update('rent-uuid', updateRentDto);

      expect(result).toEqual({ affected: 1 });
      expect(mockRentRepository.update).toHaveBeenCalledWith('rent-uuid', updateRentDto);
    });
  });

  describe('remove', () => {
    it('should delete a rent', async () => {
      mockRentRepository.findOne.mockResolvedValue(new Rent());
      mockRentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('rent-uuid');

      expect(result).toEqual({ affected: 1 });
    });

    it('should throw BadRequestException if rent is not found', async () => {
      mockRentRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-id')).rejects.toThrow(BadRequestException);
    });
  });
});
