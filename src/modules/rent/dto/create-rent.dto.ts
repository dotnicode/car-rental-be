import { IsBoolean, IsDate, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateRentDto {
  @IsUUID()
  carId: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  adminId: string;

  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @IsDate()
  @IsOptional()
  acceptedDate?: Date;

  @IsBoolean()
  @IsOptional()
  rejected?: boolean;

  @IsDate()
  dueDate: Date;

  @IsDate()
  startingDate: Date;

  @IsDate()
  endingDate: Date;
}
