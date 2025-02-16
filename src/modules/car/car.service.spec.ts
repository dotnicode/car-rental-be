import { Repository } from 'typeorm';

import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PictureService } from '../picture/picture.service';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from './entities/car.entity';
import { CAR_REPOSITORY } from './providers/car.provider';

describe('CarService', () => {
  let service: CarService;
  let repository: Repository<Car>;

  const mockDate = new Date('2024-01-01T00:00:00Z');
  const mockCar: Car = {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    pictures: [],
    color: 'red',
    passengers: 5,
    ac: true,
    pricePerDay: 100,
    createdAt: mockDate,
    updatedAt: mockDate,
    rents: [],
  };

  const mockCarRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPictureService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: CAR_REPOSITORY,
          useValue: mockCarRepository,
        },
        {
          provide: PictureService,
          useValue: mockPictureService,
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    repository = module.get<Repository<Car>>(CAR_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a car successfully', async () => {
      const createCarDto: CreateCarDto = {
        brand: 'Toyota',
        model: 'Corolla',
        pictureIds: [],
        color: 'red',
        passengers: 5,
        ac: true,
        pricePerDay: 100,
      };

      mockCarRepository.save.mockResolvedValue(mockCar);
      const result = await service.create(createCarDto);

      expect(result).toEqual(mockCar);
      expect(mockCarRepository.save).toHaveBeenCalledWith(createCarDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const expectedCars = [
        { id: 1, brand: 'Toyota', model: 'Corolla', year: 2022 },
        { id: 2, brand: 'Honda', model: 'Civic', year: 2021 },
      ];

      mockCarRepository.find.mockResolvedValue(expectedCars);

      const result = await service.findAll();

      expect(result).toEqual(expectedCars);
      expect(mockCarRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a car if found', async () => {
      const carId = '1';
      const expectedCar = {
        id: carId,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        pictures: [],
      };

      mockCarRepository.findOne.mockResolvedValue(expectedCar);

      const result = await service.findOne(carId);

      expect(result).toEqual(expectedCar);
      expect(mockCarRepository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
        relations: { pictures: true },
      });
    });

    it('should throw BadRequestException if car is not found', async () => {
      const carId = '999';

      mockCarRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(carId)).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException for database errors', async () => {
      const carId = '1';

      mockCarRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne(carId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update a car successfully', async () => {
      const carId = '1';
      const updateCarDto = {
        brand: 'Toyota Updated',
        color: 'yellow',
      };

      const existingCar = {
        id: carId,
        brand: 'Toyota',
        model: 'Corolla',
        pictures: [],
      };

      const expectedCar = { ...existingCar, ...updateCarDto };

      mockCarRepository.findOne.mockResolvedValue(existingCar);
      mockCarRepository.save.mockResolvedValue(expectedCar);

      const result = await service.update(carId, updateCarDto);

      expect(result).toEqual(expectedCar);
      expect(mockCarRepository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
        relations: { pictures: true },
      });
      expect(mockCarRepository.save).toHaveBeenCalledWith(expectedCar);
    });
  });

  describe('remove', () => {
    it('should remove a car successfully', async () => {
      const carId = '1';
      const expectedResult = {
        message: `Car #${carId} deleted successfully`,
      };

      mockCarRepository.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(carId);

      expect(result).toEqual(expectedResult);
      expect(mockCarRepository.delete).toHaveBeenCalledWith(carId);
    });
  });
});
