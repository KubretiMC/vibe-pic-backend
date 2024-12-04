import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from 'cloudinary.config';
import { Readable } from 'stream';
import { UserMainInfoDTO } from './users.dto';
import { uploadFileToCloudinary } from 'src/utils/utils';

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get(':id')
  async getUserMainInfoById(@Param('id') id: string): Promise<UserMainInfoDTO> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return {
      username: user.username,
      avatarUrl: user.avatarUrl
    };
  }
  
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    if (!file) {
      throw new Error('No file uploaded.');
    }
  
    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
  
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }  
      const result: any = await uploadFileToCloudinary(file.buffer, { folder: 'avatars' });;

      if (result) {
        await this.usersService.updateAvatar(userId, result.secureUrl, result.publicId);
  
        return {
          avatarUrl: result.secureUrl,
        };
      } else {
        console.error('Cloudinary Upload Error');
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw error;
    }
  }
  
}
