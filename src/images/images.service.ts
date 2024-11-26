import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './images.entity';
import { UsersService } from 'src/users/users.service';
import { ImageDTO, ImageWithoutTypeDTO, ImageWithUploaderIdDTO } from './images.dto';
import { startOfWeek, subWeeks, endOfWeek } from 'date-fns';
import { Like } from 'src/likes/likes.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private usersService: UsersService,
  ) {}

  private async transformImage(images: Image[]): Promise<ImageDTO[]> {
    const updatedImagesData = await Promise.all(
      images.map(async (image) => {
        const uploader = await this.usersService.findById(image.uploaderId);
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

  private applyWeekFilter(date: Date, week: 'this' | 'last' | 'beforeLast'): { startDate: Date, endDate: Date } {
    let startDate: Date;
    let endDate: Date;

    if (week === 'this') {
      startDate = startOfWeek(date, { weekStartsOn: 1 });
      endDate = endOfWeek(date, { weekStartsOn: 1 });
    } else if (week === 'last') {
      startDate = startOfWeek(subWeeks(date, 1), { weekStartsOn: 1 });
      endDate = endOfWeek(subWeeks(date, 1), { weekStartsOn: 1 });
    } else if (week === 'beforeLast') {
      startDate = startOfWeek(subWeeks(date, 2), { weekStartsOn: 1 });
      endDate = endOfWeek(subWeeks(date, 2), { weekStartsOn: 1 });
    } else {
      throw new Error('Invalid week parameter.');
    }

    return { startDate, endDate };
  }

  async findAll(week?: 'this' | 'last' | 'beforeLast', groupName?: string, mostLiked?: string): Promise<ImageDTO[]> {
    const today = new Date();
    const localToday = new Date(
      today.toLocaleString('en-US', { timeZone: 'Europe/Sofia' })
    );

    let startDate = new Date(localToday);
    let endDate = new Date(localToday);

    if (week) {
      const weekFilter = this.applyWeekFilter(localToday, week);
      startDate = weekFilter.startDate;
      endDate = weekFilter.endDate;
    }

    const query = this.imageRepository.createQueryBuilder('image')
      .leftJoinAndSelect('image.group', 'group');

    if (week) {
      query.andWhere('image.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    if (groupName) {
      query.andWhere('group.name = :groupName', { groupName });
    }

    if (mostLiked === 'images') {
      query.orderBy('image.likes', 'DESC');
    }

    const images = await query.getMany();
    return this.transformImage(images);
  }

  async findByGroup(groupName: string, week?: 'this' | 'last' | 'beforeLast', mostLiked?: string): Promise<ImageDTO[]> {
    return this.findAll(week, groupName, mostLiked);
  }

  async findByUploaderId(uploaderId: string): Promise<ImageWithUploaderIdDTO[]> {
    const images = await this.imageRepository.find({
      where: { uploaderId },
    });
    return images;
  }

  async getLikedImagesByUser(userId: string): Promise<ImageWithoutTypeDTO[]> {
    const likedImages = await this.likeRepository.find({
      where: { user: { id: userId } },
      relations: ['image'],
    });
    
    const images = likedImages.map((like) => like.image);
    return this.transformImage(images);
  }
}
