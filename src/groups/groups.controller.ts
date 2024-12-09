import { Controller, Get, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupDTO } from './groups.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Get('names')
  async getGroupNames(): Promise<string[]> {
    return this.groupService.getGroupsNames();
  }

  @Get('main-info')
  async getGroupNameAndId(): Promise<GroupDTO[]> {
    return this.groupService.getGroupNameAndId();
  }
}
