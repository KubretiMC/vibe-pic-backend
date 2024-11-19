import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Like } from './likes.entity';
import { Image } from 'src/images/images.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,

    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  async likeImage(userId: string, imageId: string): Promise<{ message: string }> {
    try {
      const existingLike = await this.likesRepository.findOne({
        where: { user: { id: userId }, image: { id: imageId } },
        withDeleted: true,
      });

      if (existingLike) {
        if (existingLike.deletedAt) {
          await this.likesRepository.restore(existingLike.id);
          await this.imagesRepository.increment({ id: imageId }, 'likes', 1);
          return { message: 'Like restored successfully' };
        }
  
        throw new BadRequestException('User has already liked this image');
      }
  
      const like = this.likesRepository.create({ user: { id: userId }, image: { id: imageId } });
      await this.likesRepository.save(like);
      await this.imagesRepository.increment({ id: imageId }, 'likes', 1);
      return { message: 'Image liked successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error liking image');
    }
  }
  

  async unlikeImage(userId: string, imageId: string): Promise<{message: string}>  {
    try {
      const likedImage = await this.likesRepository.findOne({
        where: { user: { id: userId }, image: { id: imageId } },
      });

      if (!likedImage) {
        throw new NotFoundException('Like not found');
      }

      await this.likesRepository.softDelete({ user: { id: userId }, image: { id: imageId } });
      await this.imagesRepository.decrement({ id: imageId }, 'likes', 1);
      return { message: 'Image unliked successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error unliking image');
    }
  }

  async checkBatchLikesStatus(userId: string, imageIds: string[]): Promise<{ [imageId: string]: boolean }> {
    const likes = await this.likesRepository.find({
      where: {
        user: { id: userId },
        image: { id: In(imageIds) },
      },
      relations: ['image'],
    });

    const likedImageIds = likes.map((like) => like.image.id);
    const result: { [imageId: string]: boolean } = {};

    imageIds.forEach((imageId) => {
      result[imageId] = likedImageIds.includes(imageId);
    });

    return result;
  }
  
}
