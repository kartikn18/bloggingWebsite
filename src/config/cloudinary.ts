import {v2 as Cloudinary} from 'cloudinary';
import dotnev from 'dotenv';
dotnev.config();

export const clodinaryConfig = Cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})