import cloudinary from "cloudinary.config";
import { Readable } from "stream";

export function bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

export async function uploadFileToCloudinary(
  fileBuffer: Buffer,
  options: { folder: string },
): Promise<{ secureUrl: string; publicId: string }> {
  const uploadStream = (options) =>
    new Promise<{ secureUrl: string; publicId: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      });

      bufferToStream(fileBuffer).pipe(stream);
    });

  return uploadStream(options);
}

  