import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from 'cloudinary.config';
import { Readable } from 'stream';
import { UserMainInfoDTO } from './users.dto';

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
  
      const uploadStream = (options) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
  
          bufferToStream(file.buffer).pipe(stream);
        });
  
      const result: any = await uploadStream({ folder: 'avatars' });
  
      if (result) {
        await this.usersService.updateAvatar(userId, result.secure_url, result.public_id);
  
        return {
          avatarUrl: result.secure_url,
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
