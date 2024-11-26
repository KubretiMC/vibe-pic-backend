import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './images.entity';
import { UsersModule } from 'src/users/users.module';
import { Like } from 'src/likes/likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Like]), UsersModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
