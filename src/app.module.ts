// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageService } from './services/image.service';
import { ImageController } from './controllers/image.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '192837465_Aa',
      database: 'vibe_pic_db',
      entities: [Image], // Add the Image entity here
      synchronize: true, // Turn off in production
    }),
    TypeOrmModule.forFeature([Image]), // Add here as well
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class AppModule {}
