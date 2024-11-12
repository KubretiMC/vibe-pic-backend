import { Controller, Get } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImageDTO } from './images.dto';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
  ) {}

  @Get()
  async getAllImages(): Promise<ImageDTO[]> {
    return this.imagesService.findAll();
  }
}
