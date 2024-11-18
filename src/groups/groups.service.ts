import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { GroupNameDescriptionDTO, GroupIdNameDTO } from './groups.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async getGroupNameAndId(): Promise<GroupIdNameDTO[]> {
    return this.groupRepository.find({
      select: ['id', 'name'],
    });
  }

  async getGroupByName(name: string): Promise<GroupNameDescriptionDTO> {
    return this.groupRepository.findOne({
      where: { name },
      select: ['name', 'description'],
    });
  }
}
