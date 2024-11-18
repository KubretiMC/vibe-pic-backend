import { Controller, Get, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupIdNameDTO, GroupNameDescriptionDTO } from './groups.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Get('names')
  async getGroupNameAndId(): Promise<GroupIdNameDTO[]> {
    return this.groupService.getGroupNameAndId();
  }

  @Get(':groupName/description')
  async getGroupByName(@Param('groupName') name: string): Promise<GroupNameDescriptionDTO> {
    return this.groupService.getGroupByName(name);
  }
}
