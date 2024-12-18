import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async updateAvatar(userId: string, avatarUrl: string, avatarPublicId: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found.');
    }

    user.avatarUrl = avatarUrl;
    user.avatarPublicId = avatarPublicId;
    return this.usersRepository.save(user);
  }

  async changeLanguage(userId: string, newLanguage: string): Promise<User> {
    if (!newLanguage) {
      throw new Error('Language not found.');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found.');
    }

    user.language = newLanguage;
    return await this.usersRepository.save(user);
  }
}