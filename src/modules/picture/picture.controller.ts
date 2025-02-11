import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationError,
} from '@nestjs/common';
import { PictureService } from './picture.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UploadPictureDto } from './dto/upload-picture.dto';

@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadPictureDto: UploadPictureDto,
  ) {
    const plainUploadPictureDto = plainToInstance(
      UploadPictureDto,
      uploadPictureDto,
    );
    const errors: ValidationError[] = await validate(plainUploadPictureDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.map((e) => e.constraints));
    }

    return this.pictureService.upload(file, plainUploadPictureDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pictureService.remove(id);
  }
}
