import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Like } from './likes.entity';
import { Image } from './../images/images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Image])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
