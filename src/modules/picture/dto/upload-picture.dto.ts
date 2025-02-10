import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PictureType } from '../enums/picture-type.enum';

export class UploadPictureDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @Transform((data) => data.value.toLowerCase())
  @IsEnum(PictureType)
  type: PictureType;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsNotEmpty()
  carId: string;
}
