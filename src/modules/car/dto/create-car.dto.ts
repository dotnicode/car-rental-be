import {
  IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min, MinLength
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @MinLength(2)
  brand: string;

  @IsString()
  @MinLength(2)
  model: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  pictureIds: string[];

  @IsString()
  @MinLength(2)
  color: string;

  @IsNumber()
  @Min(1)
  passengers: number;

  @IsBoolean()
  ac: boolean;

  @IsNumber()
  @Min(1)
  pricePerDay: number;
}
