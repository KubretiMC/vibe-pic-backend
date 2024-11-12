import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './images.entity';
import { UsersService } from 'src/users/users.service';
import { ImageDTO } from './images.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<ImageDTO[]> {
    const images = await this.imageRepository.find({ relations: ['group'] });

    const updatedImagesData = await Promise.all(
      images.map(async (image) => {
        const uploader = await this.usersService.findById(parseInt(image.uploaderId));
        const { uploaderId, group, likedBy, ...imageWithoutUploaderId } = image;
        return {
          ...imageWithoutUploaderId,
          imageType: image.group?.name,
          uploaderName: uploader ? uploader.username : 'Anonymous',
        };
      }),
    );
    return updatedImagesData;
  }
}
