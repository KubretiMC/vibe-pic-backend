import { Controller, Get, Param, Request, ForbiddenException, Post, Query, BadRequestException, Body } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';

@Controller('groups')
export class UserGroupsController {
  constructor(private readonly groupService: UserGroupsService) {}

  @Get(':groupId/is-member')
  async isUserInGroup(
    @Param('groupId') groupId: string,
    @Query('userId') userId: string,
  ): Promise<{ isMember: boolean }> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
  
    const isMember = await this.groupService.isUserInGroup(userId, groupId);
    return { isMember };
  }

  @Get(':groupId/images')
  async getGroupImages(
    @Param('groupId') groupId: string,
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
    @Param('groupId') groupId: string,
    @Body('userId') userId: string,
  ) {
    return await this.groupService.addUserToGroup(userId, groupId);
  }
}
