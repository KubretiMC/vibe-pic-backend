import { Controller, Get } from '@nestjs/common';
import { ImagesService } from './images.service';
import { UsersService } from 'src/users/users.service';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getAllImages(): Promise<any[]> {
    const images = await this.imagesService.findAll();

    const imagesWithUploader = await Promise.all(
      images.map(async (image) => {
        const uploader = await this.usersService.findById(parseInt(image.uploaderId));
        const { uploaderId, ...imageWithoutUploaderId } = image;
        return {
          ...imageWithoutUploaderId,
          uploaderName: uploader ? uploader.username : 'Anonymous',
        };
      })
    );
    return imagesWithUploader;
  }
}
