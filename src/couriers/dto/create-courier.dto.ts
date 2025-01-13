import { VehicleType } from '@prisma/client';
import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateCourierDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsEnum(VehicleType, {
    message: `Vehicle type must be one of the following: ${VehicleType}`,
  })
  vehicleType: VehicleType;
}
