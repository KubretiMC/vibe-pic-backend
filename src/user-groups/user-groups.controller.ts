import { Controller, Get, Param, Request, ForbiddenException, Post, Query, BadRequestException, Body } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';

@Controller('groups')
export class UserGroupsController {
  constructor(private readonly groupService: UserGroupsService) {}

  @Get(':groupName/is-member')
  async isUserInGroup(
    @Param('groupName') groupName: string,
    @Query('userId') userId: string,
  ): Promise<{ isMember: boolean }> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
  
    const isMember = await this.groupService.isUserInGroup(userId, groupName);
    return { isMember };
  }

  @Get(':groupName/images')
  async getGroupImages(
    @Param('groupName') groupName: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    const isMember = await this.groupService.isUserInGroup(userId, groupName);

    if (!isMember) {
      throw new ForbiddenException('You must join the group to view its images.');
    }

    return await this.groupService.findImagesByGroup(groupName);
  }

  @Post(':groupName/join')
  async addUserToGroup(
    @Param('groupName') groupName: string,
    @Body('userId') userId: string,
  ) {
    return await this.groupService.addUserToGroup(userId, groupName);
  }
}
