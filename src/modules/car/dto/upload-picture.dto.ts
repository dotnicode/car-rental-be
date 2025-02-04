import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CarPicture } from '../enums/car-picture.enum';

export class UploadPictureDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(CarPicture)
  @IsNotEmpty()
  type: CarPicture;

  @IsDate()
  @Type(() => Date)
  date: Date;
}
