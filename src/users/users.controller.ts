import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors, Request, Body } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from 'cloudinary.config';
import { UserMainInfoDTO } from './users.dto';
import { uploadFileToCloudinary } from 'src/utils/utils';
import { AuthGuard } from 'src/auth/auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly usersService: UsersService
  ) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get('loggedUser')
  async getUserMainInfoById(@Request() req): Promise<UserMainInfoDTO> {
    const userId = req.user.userId;
    console.log('userIDddddd', userId);
    const user = await this.usersService.findById(userId);
    console.log('gasgsagsa', user);
    if (!user) {
      throw new Error('User not found.');
    }
    return {
      username: user.username,
      avatarUrl: user.avatarUrl,
      language: user.language
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
    const userId = req.user.userId;
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
  
  @Post('change-language')
  async changeLanguage(
    @Body('language') newLanguage: string, 
    @Request() req
  ) {
    const userId = req.user.userId;

    try {
      const updatedUser = await this.usersService.changeLanguage(userId, newLanguage);
      return {
        language: updatedUser.language,
      };
    } catch (error) {
      console.error('Error updating language:', error);
      throw new Error('Error updating language.');
    }
  }
}
