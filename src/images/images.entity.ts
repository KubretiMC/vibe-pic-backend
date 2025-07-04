import { Group } from 'src/groups/groups.entity';
import { Like } from 'src/likes/likes.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ nullable: true })
  publicId: string;

  @OneToMany(() => Like, (like) => like.image)
  likedBy: Like[];

  @ManyToOne(() => Group, (group) => group.images)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @DeleteDateColumn()
  deletedAt?: Date;
}
