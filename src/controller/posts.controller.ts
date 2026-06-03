import {Request,Response,NextFunction} from 'express';
import { PostsService } from '../services/posts.services';
import { uploadToCloudinary } from '../utils/upload';
import redisclint from '../config/redis';
export const postController = {
        async createPost(req:Request,res:Response,next:NextFunction){
        const userid = req.user?.id;
      const {title,content} = req.body;
      const allowedformats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const images  = Array.isArray(req.files) ? req.files : [];
      if(images.some((file) => !allowedformats.includes(file.mimetype))) {
        return res.status(400).json({
            success:false,
            message:'Only image files are allowed (jpeg, png, gif)',
        });// return boolean and stop executing if any file is not in allowed formats
      }
      try{
        if (images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image',
            });
        }
        const uploads = await Promise.all(images.map((file) => uploadToCloudinary(file)));
        const imageUrls = uploads
            .filter((img) => img.success && img.data)
            .map((img) => img.data as string);
        if (imageUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Image upload failed',
            });
        }
       const post = await PostsService.createpost({title,content,images:images.length},userid as number,imageUrls[0]);
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
    async updatePost(req:Request,res:Response,next:NextFunction){
        const postid = req.params.id;
        const {title,content} = req.body;
        try{
        const updatepost = await PostsService.updatepost(Number(postid),{title,content} as any);
        res.status(200).json({
            success:true,
            message:'Post updated successfully',
            updatepost
        });
    }
    catch(error){
        next(error);
    }
    },
    async likePost(req:Request,res:Response,next:NextFunction){
        const postid = req.params.id;
      
        try{
            const likepost = await PostsService.likepost(Number(postid));
            res.status(200).json({
                success:true,
                message:'Post liked successfully',
                likepost
            });
        }
        catch(error){
            next(error);
        }
    },
    async getposts(req:Request,res:Response,next:NextFunction){
        try{
        const posts  = await PostsService.getallposts();
        res.status(200).json({
            success:true,
            message:'Posts fetched successfully',
            posts
        });
    }
        catch(error){
            res.status(500).json({
                success:false,
                message:'Something went wrong',
                error
            });
        }
    },
    async dashboardposts(req:Request,res:Response,next:NextFunction){
        const userid = req.user?.id;
        try{
            const cachedposts = await redisclint.get(`dashboardposts:${userid}`);
            if(cachedposts){
                return res.json({
                    success:true,
                    message:'Dashboard posts fetched successfully from cache',
                    posts:JSON.parse(cachedposts)
                })
            }
            const posts = await PostsService.dashboardposts(userid as number);
            await redisclint.set(`dashboardposts:${userid}`, JSON.stringify(posts), 'EX', 300);
            res.status(200).json({
                success:true,
                message:'Dashboard posts fetched successfully',
                posts
            });
        }
        catch(error){
            res.status(500).json({
                success:false,
                message:'Something went wrong',
                error
            });
        }
    }
}