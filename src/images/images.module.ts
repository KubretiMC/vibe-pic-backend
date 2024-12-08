import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './images.entity';
import { UsersModule } from 'src/users/users.module';
import { Like } from 'src/likes/likes.entity';
import { Group } from 'src/groups/groups.entity';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Like, Group]), UsersModule, GroupsModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
