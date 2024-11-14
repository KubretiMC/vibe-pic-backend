import { Group } from 'src/groups/groups.entity';
import { User } from 'src/users/users.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity('user_groups_associations')
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;
}
