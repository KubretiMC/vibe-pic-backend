import { Like } from 'src/likes/likes.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  avatarImage: string;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
