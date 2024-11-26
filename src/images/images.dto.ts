export class ImageDTO {
  id: string;
  description: string;
  uploaderName: string;
  likes: number;
  imagePath: string;
  createdAt: Date;
  imageType: string;
}

export type ImageWithoutTypeDTO = Omit<ImageDTO, 'imageType'>;

export type ImageWithUploaderIdDTO = Omit<ImageWithoutTypeDTO, 'uploaderName'> & { uploaderId: string };