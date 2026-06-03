import { v2 as Cloudinary } from 'cloudinary';
import type { Express } from 'express';
import '../config/cloudinary';

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder = 'bloggsimages'
): Promise<{ success: boolean; message: string; data?: string }> => {
  try {
    let result;

    if (file.buffer) {
      result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = Cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image' },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error ?? new Error('Cloudinary upload failed'));
              return;
            }
            resolve(uploadResult);
          }
        );
        stream.end(file.buffer);
      });
    } else if (file.path) {
      result = await Cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'image',
      });
    } else {
      return { success: false, message: 'No file data received' };
    }

    return {
      success: true,
      message: 'Image uploaded successfully',
      data: result.secure_url,
    };
  } catch {
    return {
      success: false,
      message: 'Error uploading image to Cloudinary. Check CLOUDINARY_* env vars.',
    };
  }
};
