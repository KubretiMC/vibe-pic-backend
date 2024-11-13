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

  async getGroupNameAndId(): Promise<GroupDTO[]> {
    return this.groupRepository.find({
      select: ['id', 'name'],
    });
  }
}
