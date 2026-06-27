import {PutObjectCommand} from '@aws-sdk/client-s3';
import { s3client } from '../config/S3';


export const postImageUploadtos3 = async (
  file: Express.Multer.File
): Promise<{ success: boolean; message: string; data?: string }> => {
  try {
      const Bucket = process.env.AWS_S3_BUCKET_NAME ||'' ;
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
      const region = process.env.AWS_REGION || 'ap-south-1'; 
      const url = `https://${Bucket}.s3.${region}.amazonaws.com/${Key}`;

      return { success: true, message: 'Image uploaded to S3', data: url };
    } catch (err) {
      console.error('Error uploading to S3:', err);
      return { success: false, message: 'Error uploading image to S3' };
    }
  }