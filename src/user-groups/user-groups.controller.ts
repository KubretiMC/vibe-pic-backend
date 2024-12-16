import { Controller, Get, Param, Request, ForbiddenException, Post, BadRequestException, UseGuards } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly groupService: UserGroupsService) {}

  @Get(':groupName/is-member')
  async isUserInGroup(
    @Request() req,
    @Param('groupName') groupName: string,
  ): Promise<{ isMember: boolean }> {
    const userId = req.user.userId;
    console.log('hhhhhhhhhhhhhhhh', req.user);
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
    const userId = req.user.userId;
    const isMember = await this.groupService.isUserInGroup(userId, groupName);

    if (!isMember) {
      throw new ForbiddenException('You must join the group to view its images.');
    }

    return await this.groupService.findImagesByGroup(groupName);
  }

  @Post(':groupName/join')
  async addUserToGroup(
    @Request() req,
    @Param('groupName') groupName: string,
  ) {
    const userId = req.user.userId;
    return await this.groupService.addUserToGroup(userId, groupName);
  }

  @Get(':groupName/details')
  async getGroupDetails(@Param('groupName') groupName: string) {
    return this.groupService.getGroupDetails(groupName);
  }
}
