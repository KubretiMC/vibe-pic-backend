import { Controller, Get, Param, ParseIntPipe, Request, ForbiddenException, Post } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';

@Controller('groups')
export class UserGroupsController {
  constructor(private readonly groupService: UserGroupsService) {}

  @Get(':groupId/is-member')
  async isUserInGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Request() req,
  ): Promise<{ isMember: boolean }> {
    const userId = req.user.id;
    const isMember = await this.groupService.isUserInGroup(userId, groupId);
    return { isMember };
  }

  @Get(':groupId/images')
  async getGroupImages(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    const isMember = await this.groupService.isUserInGroup(userId, groupId);

    if (!isMember) {
      throw new ForbiddenException('You must join the group to view its images.');
    }

    return await this.groupService.findImagesByGroup(groupId);
  }

  @Post(':groupId/join')
  async addUserToGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    return await this.groupService.addUserToGroup(userId, groupId);
  }
}
