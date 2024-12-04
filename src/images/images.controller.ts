import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImageDTO, ImageWithoutTypeDTO, ImageWithUploaderIdDTO } from './images.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/users/users.service';
import { uploadFileToCloudinary } from 'src/utils/utils';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly usersService: UsersService
  ) {}

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

  @Get('by-uploader')
  async getImagesByUploader(
    @Query('uploaderId') uploaderId: string
  ): Promise<ImageWithUploaderIdDTO[]> {
    return this.imagesService.findByUploaderId(uploaderId);
  }
  
  @Get('liked-by-user')
  async getLikedImagesByUser(
    @Query('userId') userId: string
  ): Promise<ImageWithoutTypeDTO[]> {
    return this.imagesService.getLikedImagesByUser(userId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    console.log('fsafasfas', userId);
    if (!file) {
      throw new Error('No file uploaded.');
    }

    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      const result: any = await uploadFileToCloudinary(file.buffer, { folder: 'avatars' });;

      if (result) {
        const imageRecord = await this.imagesService.saveImageMetadata(
          file.originalname,
          result.secureUrl,
          result.publicId,
          userId,
        );

        return {
          imageUrl: result.secure_url,
          imageId: imageRecord.id,
        };
      } else {
        console.error('Cloudinary Upload Error');
        throw new Error('Failed to upload the image.');
      }
    } catch (error) {
      console.error('Error during upload:', error);
      throw error;
    }
  }
}
