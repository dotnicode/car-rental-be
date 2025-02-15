import { IsString, IsUUID } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUUID()
  userId: string;
}
