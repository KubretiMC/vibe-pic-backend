// src/services/image.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async findAll(): Promise<Image[]> {
    return await this.imageRepository.find();
  }
}
