import {Request,Response,NextFunction} from 'express';
import {middleare} from '../middleware/islogin'
import { PostsService } from '../services/posts.services';
import { uploadToCloudinary } from '../utils/upload';
import multer from 'multer';

export const postController = {
        async createPost(req:Request,res:Response,next:NextFunction){
            const userid = req.user?.id;
      const {title,content} = req.body;
      const images  = Array.isArray(req.files) ? req.files : [];
      try{
        const image = await Promise.all(images.map((file)=>uploadToCloudinary(file.path)));
        const noofimages = images.length;
        const imagesurl = image.map((img)=>img.data);
                if(image.length === 0){
            return res.status(400).json({
                success:false,
                message:'Please upload at least one image'
            });
        }
       const post = await PostsService.createpost({title,content,images:noofimages},userid as number,imagesurl[0].secure_url);
       res.status(201).json({
        success:true,
        message:'Post created successfully',
        post
       });
      }
        catch(error){
            next(error);
        }
    },
    
        
      }