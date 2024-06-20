import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { DatabaseService } from 'src/database/database.service';

describe('LocationService', () => {
  let service: LocationService;
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(async () => {
    const mockDatabaseService = {
      location: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    databaseService = module.get(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a location successfully', async () => {
      const createLocationDto = {
        building_name: 'Test Building',
        room_name: 'Test Room',
        location_number: '123',
        area: 100,
        parent_location_id: null,
      };

      (databaseService.location.create as jest.Mock).mockReturnValue({
        id: 1,
        ...createLocationDto,
      });

      const result = await service.create(createLocationDto);

      expect(result).toEqual({ id: 1, ...createLocationDto });
      expect(databaseService.location.create).toHaveBeenCalledWith({
        data: createLocationDto,
        include: { parent_location: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const mockLocations = [
        { id: 1, building_name: 'Building 1' },
        { id: 2, building_name: 'Building 2' },
      ];
      (databaseService.location.findMany as jest.Mock).mockReturnValue(mockLocations);

      const result = await service.findAll();

      expect(result).toEqual(mockLocations);
      expect(databaseService.location.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single location', async () => {
      const mockLocation = { id: 1, building_name: 'Test Building' };
      (databaseService.location.findUnique as jest.Mock).mockReturnValue(mockLocation);

      const result = await service.findOne(1);

      expect(result).toEqual(mockLocation);
      expect(databaseService.location.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { parent_location: true, child_locations: true },
      });
    });
  });

  describe('update', () => {
    it('should update a location successfully', async () => {
      const updateLocationDto = {
        building_name: 'Test Building',
        room_name: 'Test Room',
        location_number: '123',
        area: 100,
        parent_location_id: null,
      };
      const mockLocation = { id: 1, building_name: 'Test Building' };
      (databaseService.location.findUnique as jest.Mock).mockReturnValue(mockLocation);
      (databaseService.location.update as jest.Mock).mockReturnValue({
        ...mockLocation,
        ...updateLocationDto,
      });

      const result = await service.update(1, updateLocationDto);

      expect(result).toEqual({ ...mockLocation, ...updateLocationDto });
      expect(databaseService.location.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a location successfully', async () => {
      const mockLocation = { id: 1, building_name: 'Test Building' };
      (databaseService.location.findUnique as jest.Mock).mockReturnValue(mockLocation);
      (databaseService.location.findMany as jest.Mock).mockReturnValue([]);
      (databaseService.location.delete as jest.Mock).mockReturnValue(mockLocation);

      const result = await service.remove(1);

      expect(result).toEqual(mockLocation);
      expect(databaseService.location.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
