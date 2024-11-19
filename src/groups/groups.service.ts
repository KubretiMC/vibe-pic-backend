import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { GroupNameDescriptionDTO } from './groups.dto';

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

  async getGroupByName(name: string): Promise<GroupNameDescriptionDTO> {
    return this.groupRepository.findOne({
      where: { name },
      select: ['name', 'description'],
    });
  }
}
