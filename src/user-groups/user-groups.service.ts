import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGroup } from './user-groups.entity';
import { Image } from './../images/images.entity';

@Injectable()
export class UserGroupsService {
  constructor(
    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async isUserInGroup(userId: number, groupId: number): Promise<boolean> {
    const userGroup = await this.userGroupRepository.findOne({
      where: { user: { id: userId }, group: { id: groupId } },
      relations: ['user', 'group'],
    });
    return !!userGroup;
  }

  async findImagesByGroup(groupId: number): Promise<Image[]> {
    return await this.imageRepository.find({
      where: { group: { id: groupId } },
      relations: ['group'],
    });
  }

  async addUserToGroup(userId: number, groupId: number): Promise<UserGroup> {
    const existingUserGroup = await this.userGroupRepository.findOne({
      where: { user: { id: userId }, group: { id: groupId } },
      relations: ['user', 'group'],
    });
    
    if (existingUserGroup) {
      throw new Error('User is already in the group');
    }

    const userGroup = this.userGroupRepository.create({ 
      user: { id: userId },
      group: { id: groupId },
    });
    return await this.userGroupRepository.save(userGroup);
  }
}
