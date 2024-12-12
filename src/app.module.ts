import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_ADDON_HOST'),
        port: +configService.get<number>('MYSQL_ADDON_PORT'),
        username: configService.get<string>('MYSQL_ADDON_USER'),
        password: configService.get<string>('MYSQL_ADDON_PASSWORD'),
        database: configService.get<string>('MYSQL_ADDON_DB'),
        entities: [Image, User, Like, Group, UserGroup],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GroupsModule,
    ImagesModule,
    UsersModule,
    LikesModule,
    UserGroupsModule,
  ],
})
export class AppModule {}
