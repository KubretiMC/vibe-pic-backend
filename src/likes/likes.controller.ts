import { Controller, Post, Body, Get, Query, UseGuards, Request } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('like')
  async likeImage(@Request() req, @Body('imageId') imageId: string ) {
    const userId = req.user.userId;
    return this.likesService.likeImage(userId, imageId);
  }

  @Post('unlike')
  async unlikeImage(@Request() req, @Body('imageId') imageId: string ) {
    const userId = req.user.userId;
    return this.likesService.unlikeImage(userId, imageId);
  }

  @Get('batch-likes-status')
  async checkBatchLikesStatus(
    @Request() req,
    @Query('imageIds') imageIds: string,
  ) {
    const userId = req.user.userId;
    const imageIdArray = imageIds.split(',');
    const likeStatuses = await this.likesService.checkBatchLikesStatus(userId, imageIdArray);
    return { likeStatuses };
  }
}
