import { Controller, Get } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Image } from './images.entity';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAllImages(): Promise<Image[]> {
    return this.imagesService.findAll();
  }
}
