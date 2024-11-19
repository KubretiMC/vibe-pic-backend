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

  private async transformImage(image: Image): Promise<ImageDTO> {
    const uploader = await this.usersService.findById(image.uploaderId);
    const { uploaderId, group, likedBy, ...imageWithoutUploaderId } = image;

    return {
      ...imageWithoutUploaderId,
      imageType: group?.name || 'Unknown',
      uploaderName: uploader?.username || 'Anonymous',
    };
  }

  async findAll(): Promise<ImageDTO[]> {
    const images = await this.imageRepository.find({ relations: ['group'] });
    return Promise.all(images.map((image) => this.transformImage(image)));
  }

  async findByGroup(groupName: string): Promise<ImageDTO[]> {
    const images = await this.imageRepository.find({
      where: { group: { name: groupName } },
      relations: ['group'],
    });
    return Promise.all(images.map((image) => this.transformImage(image)));
  }
}
