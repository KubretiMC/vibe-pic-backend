// src/entities/image.entity.ts
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
  type: string;

  @Column()
  createdAt: string;

  @Column()
  likes: number;
}
