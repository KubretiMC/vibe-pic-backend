import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uploaderId: string;

  @Column()
  description: string;

  @Column()
  imageType: string;

  @Column()
  createdAt: Date;

  @Column()
  likes: number;

  @Column()
  imagePath: string;
}
