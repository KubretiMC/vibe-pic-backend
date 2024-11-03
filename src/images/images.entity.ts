import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
  likes: number;

  @Column()
  imagePath: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
