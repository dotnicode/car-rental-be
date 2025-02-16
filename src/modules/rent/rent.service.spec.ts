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
        acceptedDate: null,
        rejected: false,
        dueDate: new Date(),
        startingDate: new Date(),
        endingDate: new Date(),
      };

      const expectedResult = {
        ...createRentDto,
        id: 'rent-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCarService.findOne.mockResolvedValue(createRentDto.carId);
      mockUserService.findOne.mockResolvedValue(createRentDto.userId);
      mockRentRepository.save.mockResolvedValue(expectedResult);

      const result = await service.create(createRentDto);

      expect(result).toEqual(expectedResult);
      expect(mockRentRepository.save).toHaveBeenCalledWith(createRentDto);
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
      mockRentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('rent-uuid');
      expect(result).toBeTruthy();
    });
  });
});
