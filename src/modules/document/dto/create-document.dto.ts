import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
