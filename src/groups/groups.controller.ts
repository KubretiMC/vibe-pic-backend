import { Controller, Get } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupDTO } from './groups.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Get()
  async getGroupNameAndId(): Promise<GroupDTO[]> {
    return this.groupService.getGroupNameAndId();
  }
}
