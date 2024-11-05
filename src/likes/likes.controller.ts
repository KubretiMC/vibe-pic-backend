import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('like')
  async likeImage(@Body() body: { imageId: number; userId: number }) {
    const { imageId, userId } = body;
    return this.likesService.likeImage(userId, imageId);
  }

  @Post('unlike')
  async unlikeImage(@Body() body: { imageId: number; userId: number }) {
    const { imageId, userId } = body;
    return this.likesService.unlikeImage(userId, imageId);
  }

  @Get('batch-likes-status')
  async checkBatchLikesStatus(
    @Query('userId') userId: number,
    @Query('imageIds') imageIds: string,
  ) {
    const imageIdArray = imageIds.split(',').map(Number);
    const likeStatuses = await this.likesService.checkBatchLikesStatus(userId, imageIdArray);
    return { likeStatuses };
  }
}
