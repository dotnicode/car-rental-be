import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { Rent } from './entities/rent.entity';

describe('RentController', () => {
  let controller: RentController;
  let service: RentService;

  const mockRentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentController],
      providers: [
        {
          provide: RentService,
          useValue: mockRentService,
        },
      ],
    }).compile();

    controller = module.get<RentController>(RentController);
    service = module.get<RentService>(RentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
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

      const expectedResult = {
        id: 'rent-uuid',
        car: { id: createRentDto.carId },
        user: { id: createRentDto.userId },
        admin: { id: createRentDto.adminId },
        pricePerDay: createRentDto.pricePerDay,
        acceptedDate: createRentDto.acceptedDate,
        rejected: createRentDto.rejected,
        dueDate: createRentDto.dueDate,
        startingDate: createRentDto.startingDate,
        endingDate: createRentDto.endingDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRentService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createRentDto);

      expect(result).toEqual(expectedResult);
      expect(mockRentService.create).toHaveBeenCalledWith(createRentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of rents', async () => {
      const rents = [new Rent(), new Rent()];
      mockRentService.findAll.mockResolvedValue(rents);

      const result = await controller.findAll();
      expect(result).toEqual(rents);
      expect(mockRentService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a rent by ID', async () => {
      const rent = new Rent();
      mockRentService.findOne.mockResolvedValue(rent);

      const result = await controller.findOne('rent-uuid');
      expect(result).toEqual(rent);
      expect(mockRentService.findOne).toHaveBeenCalledWith('rent-uuid');
    });

    it('should throw BadRequestException if rent is not found', async () => {
      mockRentService.findOne.mockRejectedValue(new BadRequestException());

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a rent', async () => {
      const updateRentDto = {
        pricePerDay: 60,
        rejected: true,
      };

      const updateResult = { affected: 1 };
      mockRentService.update.mockResolvedValue(updateResult);

      const result = await controller.update('rent-uuid', updateRentDto);

      expect(result).toEqual(updateResult);
      expect(mockRentService.update).toHaveBeenCalledWith('rent-uuid', updateRentDto);
    });
  });

  describe('remove', () => {
    it('should delete a rent', async () => {
      const deleteResult = { affected: 1 };
      mockRentService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove('rent-uuid');

      expect(result).toEqual(deleteResult);
      expect(mockRentService.remove).toHaveBeenCalledWith('rent-uuid');
    });

    it('should throw BadRequestException if rent is not found', async () => {
      mockRentService.remove.mockRejectedValue(new BadRequestException());

      await expect(controller.remove('non-existent-id')).rejects.toThrow(BadRequestException);
    });
  });
});
