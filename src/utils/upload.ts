
import { ColumnDefinitionBuilder } from 'kysely';
import {clodinaryConfig}  from '../config/cloudinary';
import {v2 as Cloudinary} from 'cloudinary';


// asn instancee of cloudinary created in the clodinary config so i use the cloudinary config to uplaod the image to cloudinary and return the url of the uploaded image to the client
export const uploadToCloudinary = async(filePath:string,folder:string = 'bloggsimages')=>{
    try {
        const upload = await  Cloudinary.uploader.upload(filePath,{
            folder,
            resource_type:'image'
        });
        return {
            success : true,
            message:'Image uploaded successfully',
            data:upload.secure_url,
        }
    } catch (error) {
        return {
            success : false,
            message:`Error uploading image to cloudinary`
        }
    }
}