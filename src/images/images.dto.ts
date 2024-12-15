export class ImageDTO {
  id: string;
  description: string;
  uploaderName: string;
  likes: number;
  imagePath: string;
  createdAt: Date;
  groupName: string;
  uploaderAvatar?: string;
}

export type ImageWithoutTypeDTO = Omit<ImageDTO, 'groupName'>;

export type ImageWithUploaderIdDTO = Omit<ImageWithoutTypeDTO, 'uploaderName'> & { uploaderId: string };