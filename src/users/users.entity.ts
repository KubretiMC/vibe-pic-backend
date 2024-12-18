import { Like } from 'src/likes/likes.entity';
import { UserGroup } from 'src/user-groups/user-groups.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  avatarPublicId: string;

  @Column()
  language: string;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroups: UserGroup[];
}
