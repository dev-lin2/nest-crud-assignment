import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class locationCreateValidator implements Prisma.LocationCreateInput {
  @IsNotEmpty()
  @IsString()
  building_name: string;

  @IsString()
  room_name: string;

  @IsNotEmpty()
  @IsString()
  location_number: string;

  @IsNumber()
  area: number;

  @IsOptional()
  parent_location_id: number;

  @IsOptional()
  parent_location?: Prisma.LocationCreateNestedOneWithoutChild_locationsInput;
}