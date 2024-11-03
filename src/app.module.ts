import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './images/images.entity';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '192837465_Aa',
      database: 'vibe_pic_db',
      entities: [Image, User],
      synchronize: true,
    }),
    ImagesModule,
    UsersModule
  ],
})
export class AppModule {}
