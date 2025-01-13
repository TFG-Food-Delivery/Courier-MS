import { PartialType } from '@nestjs/mapped-types';
import { CreateCourierDto } from './create-courier.dto';
import { IsUUID } from 'class-validator';

export class UpdateCourierDto extends PartialType(CreateCourierDto) {
  @IsUUID(4)
  id: string;
}
