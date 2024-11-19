import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './../images/images.entity';
import { User } from './../users/users.entity';
import { UserGroupsController } from './user-groups.controller';
import { UserGroupsService } from './user-groups.service';
import { UserGroup } from './user-groups.entity';
import { Group } from './../groups/groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserGroup, Image, User])],
  controllers: [UserGroupsController],
  providers: [UserGroupsService],
  exports: [UserGroupsService],
})
export class UserGroupsModule {}
