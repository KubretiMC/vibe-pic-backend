import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { GroupDTO } from './groups.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async getGroupsNames(): Promise<string[]> {
    const groups = await this.groupRepository.find({
      select: ['name'],
    });
    return groups.map(group => group.name);
  } 

  async findById(id: string): Promise<GroupDTO | null> {
    return await this.groupRepository.findOne({ where: { id } });
  }

  async getGroupNameAndId(): Promise<GroupDTO[]> {
    const groups = await this.groupRepository.find({
      select: ['id', 'name'],
    });
    return groups;
  }  

  async getGroupByName(name: string): Promise<GroupDTO> {
    return this.groupRepository.findOne({
      where: { name },
    });
  }
}
