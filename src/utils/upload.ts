import { v2 as Cloudinary } from 'cloudinary';
import type { Express } from 'express';
import '../config/cloudinary';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import { s3client } from '../config/S3';
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

export const postImageUploadtos3 = async (
  file: Express.Multer.File
): Promise<{ success: boolean; message: string; data?: string }> => {
  try {
      const Bucket = process.env.AWS_S3_BUCKET_NAME || '';
      if (!Bucket) {
        return { success: false, message: 'S3 bucket not configured' };
      }

      const Key = `${Date.now()}-${file.originalname}`;

      const Body = file.buffer ?? require('fs').createReadStream((file as any).path);

      const params = {
        Bucket,
        Key,
        Body,
        ContentType: file.mimetype,
      };

      await s3client.send(new PutObjectCommand(params));

      const url = `https://${Bucket}.s3.amazonaws.com/${Key}`;

      return { success: true, message: 'Image uploaded to S3', data: url };
    } catch (err) {
      return { success: false, message: 'Error uploading image to S3' };
    }
  }