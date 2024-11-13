import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './images/images.entity';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { LikesModule } from './likes/likes.module';
import { Like } from './likes/likes.entity';
import { Group } from './groups/groups.entity';
import { UserGroup } from './user-groups/user-groups.entity';
import { UserGroupsModule } from './user-groups/user-group.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '192837465_Aa',
      database: 'vibe_pic_db',
      entities: [Image, User, Like, Group, UserGroup],
      synchronize: true,
    }),
    GroupsModule,
    ImagesModule,
    UsersModule,
    LikesModule,
    UserGroupsModule
  ],
})
export class AppModule {}
