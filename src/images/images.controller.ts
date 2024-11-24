import { Controller, Get, Query } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImageDTO } from './images.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAllImages(
    @Query('week') week?: 'this' | 'last' | 'beforeLast',
    @Query('groupName') groupName?: string,
    @Query('mostLiked') mostLiked?: string
  ): Promise<ImageDTO[]> {
    return this.imagesService.findAll(week, groupName, mostLiked);
  }

  @Get('group')
  async getImagesByGroup(
    @Query('groupName') groupName: string,
    @Query('week') week?: 'this' | 'last' | 'beforeLast',
    @Query('mostLiked') mostLiked?: string
  ): Promise<ImageDTO[]> {
    return this.imagesService.findByGroup(groupName, week, mostLiked);
  }
}
