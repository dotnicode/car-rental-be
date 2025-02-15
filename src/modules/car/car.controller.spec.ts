import { Test, TestingModule } from '@nestjs/testing';

import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { CarNotFoundException } from './exceptions/car-not-found.exception';

describe('CarController', () => {
  let controller: CarController;
  let service: CarService;

  const mockDate = new Date('2024-01-01T00:00:00Z');
  const mockCar: Car = {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    pictures: [],
    color: 'Red',
    passengers: 5,
    ac: true,
    pricePerDay: 100,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockCarService = {
    create: jest.fn().mockResolvedValue(mockCar),
    findAll: jest.fn().mockResolvedValue([mockCar]),
    findOne: jest.fn<Promise<Car | null>, [string]>().mockImplementation((id) => {
      return id === '1' ? Promise.resolve(mockCar) : Promise.reject(new CarNotFoundException(id));
    }),
    update: jest
      .fn<Promise<Car | null>, [string, UpdateCarDto]>()
      .mockImplementation((id, updateCarDto) => {
        return id === '1' ? Promise.resolve(mockCar) : Promise.reject(new CarNotFoundException(id));
      }),
    remove: jest.fn<Promise<void>, [string]>().mockImplementation((id) => {
      return id === '1' ? Promise.resolve(undefined) : Promise.reject(new CarNotFoundException(id));
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: mockCarService,
        },
      ],
    }).compile();

    controller = module.get<CarController>(CarController);
    service = module.get<CarService>(CarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with correct parameters and return the result', async () => {
      const createCarDto: CreateCarDto = {
        brand: 'Toyota',
        model: 'Corolla',
        pictureIds: [],
        color: 'Red',
        passengers: 5,
        ac: true,
        pricePerDay: 100,
      };

      const car = await controller.create(createCarDto);
      expect(car).toEqual(mockCar);
      expect(mockCarService.create).toHaveBeenCalledWith(createCarDto);
    });
  });

  describe('findAll', () => {
    it('should return all available cars', async () => {
      const cars = await controller.findAll();
      expect(cars).toEqual([mockCar]);
      expect(mockCarService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a car when it exists', async () => {
      const car = await controller.findOne('1');
      expect(car).toEqual(mockCar);
      expect(mockCarService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw CarNotFoundException when car does not exist', async () => {
      await expect(controller.findOne('999')).rejects.toThrow(CarNotFoundException);
    });
  });

  describe('update', () => {
    it('should update a car when it exists', async () => {
      const updateCarDto: UpdateCarDto = {
        brand: 'Octane',
        model: 'Classic',
      };
      const car = await controller.update('1', updateCarDto);
      expect(car).toEqual(mockCar);
      expect(mockCarService.update).toHaveBeenCalledWith('1', updateCarDto);
    });

    it('should throw CarNotFoundException when car to update does not exist', async () => {
      const updateCarDto: UpdateCarDto = { brand: 'New' };
      await expect(controller.update('999', updateCarDto)).rejects.toThrow(CarNotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a car when it exists', async () => {
      await controller.remove('1');
      expect(mockCarService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw CarNotFoundException when car to remove does not exist', async () => {
      await expect(controller.remove('999')).rejects.toThrow(CarNotFoundException);
    });
  });
});
