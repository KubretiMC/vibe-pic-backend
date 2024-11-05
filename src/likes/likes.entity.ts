import { User } from 'src/users/users.entity';
import { Image } from 'src/images/images.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Image, image => image.likedBy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'imageId' })
  image: Image;

  @DeleteDateColumn()
  deletedAt?: Date;
}
