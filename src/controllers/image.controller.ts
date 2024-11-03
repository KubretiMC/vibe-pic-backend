// src/controllers/image.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ImageService } from '../services/image.service';
import { Image } from '../entities/image.entity';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  async getAllImages(): Promise<Image[]> {
    return this.imageService.findAll();
  }
}
