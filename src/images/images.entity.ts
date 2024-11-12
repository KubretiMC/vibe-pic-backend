import { Group } from 'src/groups/groups.entity';
import { Like } from 'src/likes/likes.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uploaderId: string;

  @Column()
  description: string;

  @Column()
  likes: number;

  @Column()
  imagePath: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Like, (like) => like.image)
  likedBy: Like[];

  @ManyToOne(() => Group, (group) => group.images)
  @JoinColumn({ name: 'groupId' })
  group: Group;
}
