import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from 'cloudinary.config';
import { UserMainInfoDTO } from './users.dto';
import { uploadFileToCloudinary } from 'src/utils/utils';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get('loggedUser')
  async getUserMainInfoById(@Request() req, @Param('id') id: string): Promise<UserMainInfoDTO> {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
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
    @Request() req,
  ) {
    if (!file) {
      throw new Error('No file uploaded.');
    }
    const userId = req.user.id;
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
