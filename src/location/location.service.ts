import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DatabaseService } from 'src/database/database.service';
import { locationCreateValidator } from './dto/locationCreateValidator';
import { locationUpdateValidator } from './dto/locationUpdateValidator';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    private databaseService: DatabaseService,
  ) {}

  async create(createLocationDto: Prisma.LocationCreateInput) {
    // perform validation
    const validation = plainToInstance(
      locationCreateValidator,
      createLocationDto,
    );

    const errors = await validate(validation);

    if (errors.length > 0) {
      const validationErrors = errors.map((error) =>
        Object.values(error.constraints),
      );
      this.logger.log('Create input validation errors', validationErrors);
      throw new BadRequestException(validationErrors);
    }

    // if the location have parent_location, need to get the location_number
    const { location_number, parent_location_id } = createLocationDto;

    let modifiedLocationNumber = location_number;

    // check if the input has parent location
    // we need to get the location_number so that we can append
    if (parent_location_id) {
      const parentLocation = await this.databaseService.location.findUnique({
        where: { id: parent_location_id },
        select: { location_number: true },
      });

      if (parentLocation) {
        modifiedLocationNumber = `${parentLocation.location_number}-${location_number}`;
      }
    }

    return await this.databaseService.location.create({
      data: {
        ...createLocationDto,
        location_number: modifiedLocationNumber,
      },
      include: {
        // we would like to show associated parent location
        parent_location: true,
      },
    });
  }

  async findAll() {
    return await this.databaseService.location.findMany({
      include: {
        parent_location: true,
        child_locations: true,
      },
    });
  }

  async findOne(id: number) {
    const location = await this.databaseService.location.findUnique({
      where: {
        id,
      },
      include: {
        parent_location: true,
        child_locations: true,
      },
    });

    if (!location) {
      this.logger.log(`Location not found with id : ${id}`);
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async update(id: number, updateLocationDto: Prisma.LocationUpdateInput) {
    // get the location
    const location = await this.databaseService.location.findUnique({
      where: {
        id,
      },
      include: {
        parent_location: true,
      },
    });

    if (!location) {
      this.logger.log(`Location not found with id : ${id}`);
      throw new NotFoundException('Location not found');
    }

    // perform validation
    const validation = plainToInstance(
      locationUpdateValidator,
      updateLocationDto,
    );

    const errors = await validate(validation);

    // if validation have errors, return the error messages
    if (errors.length > 0) {
      const validationErrors = errors.map((error) =>
        Object.values(error.constraints),
      );
      this.logger.log('Update input validation errors', validationErrors);
      throw new BadRequestException(validationErrors);
    }

    const { location_number } = updateLocationDto;

    // getting the parent location's number if exist
    let locationNumber = '';

    if (location.parent_location_id) {
      locationNumber = `${location.parent_location.location_number}-${location_number}`;
    }

    return await this.databaseService.location.update({
      where: {
        id,
      },
      data: {
        ...updateLocationDto,
        location_number: locationNumber,
      },
      include: {
        // we would like to show associated parent location
        parent_location: true,
      },
    });
  }

  async remove(id: number) {
    // get the location
    const location = await this.databaseService.location.findUnique({
      where: {
        id,
      },
      include: {
        parent_location: true,
      },
    });

    if (!location) {
      this.logger.log(`Location not found with id : ${id}`);
      throw new NotFoundException('Location not found');
    }

    try {
      // Check if the location has child locations
      const childLocations = await this.databaseService.location.findMany({
        where: {
          parent_location_id: id,
        },
      });

      // If the location has child locations, throw an error or handle it accordingly
      if (childLocations.length > 0) {
        this.logger.log('Trying to delete location with child locations');
        throw new ForbiddenException(
          'Cannot delete a location with child locations',
        );
      }

      // Delete the location
      return await this.databaseService.location.delete({
        where: {
          id: location.id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
