import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGroup } from './user-groups.entity';
import { Image } from './../images/images.entity';
import { Group } from 'src/groups/groups.entity';

@Injectable()
export class UserGroupsService {
  constructor(
    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async isUserInGroup(userId: string, groupName: string): Promise<boolean> {
    const group = await this.groupRepository.findOne({
      where: { name: groupName },
    });

    const userGroup = await this.userGroupRepository.findOne({
      where: { user: { id: userId }, group: { id: group.id } },
      relations: ['user', 'group'],
    });
    return !!userGroup;
  }

  async findImagesByGroup(groupName: string): Promise<Image[]> {
    return await this.imageRepository.find({
      where: { group: { name: groupName } },
      relations: ['group'],
    });
  }

  async addUserToGroup(userId: string, groupName: string): Promise<UserGroup> {
    const group = await this.groupRepository.findOne({
      where: { name: groupName },
    });
    
    if(group) {
      try{
        const existingUserGroup = await this.userGroupRepository.findOne({
          where: { user: { id: userId }, group: { id: group.id } },
          relations: ['user', 'group'],
        });
    
        if (existingUserGroup) {
          throw new Error('User is already in the group');
        }
        
        const userGroup = this.userGroupRepository.create({ 
          user: { id: userId },
          group: { id: group.id },
        });
        
        return await this.userGroupRepository.save(userGroup);
      } catch(err) {
        throw new Error('Unexpected error occured');
      }
    }
  }
}
