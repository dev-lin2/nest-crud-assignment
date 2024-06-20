import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class locationUpdateValidator implements Prisma.LocationCreateInput {
  @IsNotEmpty()
  building_name: string;

  @IsString()
  room_name: string;

  @IsString()
  location_number: string;

  @IsNumber()
  area: number;

  @IsOptional()
  parent_location_id: number;
  
  @IsOptional()
  parent_location?: Prisma.LocationCreateNestedOneWithoutChild_locationsInput;
}