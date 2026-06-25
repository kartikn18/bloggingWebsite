import { Request, Response, NextFunction } from 'express';
import { PostsService } from '../services/posts.services';
import { uploadToCloudinary,postImageUploadtos3 } from '../utils/upload';

import {redis} from '../config/redis'

export const postController = {
    async createPost(req: Request, res: Response, next: NextFunction) {
        const userid = req.user?.id;
        const { title, content } = req.body;
        const allowedformats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const images = Array.isArray(req.files) ? req.files : [];

        if (images.some((file) => !allowedformats.includes(file.mimetype))) {
            return res.status(400).json({
                success: false,
                message: 'Only image files are allowed (jpeg, png, gif, webp)',
            });
        }

        try {
            if (images.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload at least one image',
                });
            }

            const uploads = await Promise.all(images.map((file) => postImageUploadtos3(file)));
            const imageUrls = uploads
                .filter((img) => img.success && img.data)
                .map((img) => img.data as string);

            if (imageUrls.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Image upload failed',
                });
            }

            const post = await PostsService.createpost(
                { title, content, images: images.length },
                userid as number,
                imageUrls[0]
            );

            // Bust the dashboard cache so the new post shows immediately
            await redis.del(`dashboardposts:${userid}`);

            return res.status(201).json({
                success: true,
                message: 'Post created successfully',
                post,
            });
        } catch (error) {
            next(error);
        }
    },

    async updatePost(req: Request, res: Response, next: NextFunction) {
        const postid = req.params.id;
        const { title, content } = req.body;
        try {
            const updatepost = await PostsService.updatepost(Number(postid), { title, content } as any);
            return res.status(200).json({
                success: true,
                message: 'Post updated successfully',
                updatepost,
            });
        } catch (error) {
            next(error);
        }
    },

    async likePost(req: Request, res: Response, next: NextFunction) {
        const postid = req.params.id;
        const userid = req.user?.id;  // needed for toggle logic
        try {
            const result = await PostsService.likepost(Number(postid), userid as number);
            return res.status(200).json({
                success: true,
                message: result.liked ? 'Post liked' : 'Post unliked',
                liked: result.liked,
                post: result.post,
            });
        } catch (error) {
            next(error);
        }
    },

    async getposts(req: Request, res: Response, next: NextFunction) {
        try {
            const posts = await PostsService.getallposts();
            return res.status(200).json({
                success: true,
                message: 'Posts fetched successfully',
                posts,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Something went wrong', error });
        }
    },

    async dashboardposts(req: Request, res: Response, next: NextFunction) {
        const userid = req.user?.id;
        try {
            const cachedposts = await redis.get(`dashboardposts:${userid}`);
            if (typeof cachedposts === 'string') {
                return res.json({
                    success: true,
                    message: 'Dashboard posts fetched successfully from cache',
                    posts: JSON.parse(cachedposts),
                });
            }
            const posts = await PostsService.dashboardposts(userid as number);
            await redis.set(`dashboardposts:${userid}`, JSON.stringify(posts), { ex: 300 });
            return res.status(200).json({
                success: true,
                message: 'Dashboard posts fetched successfully',
                posts,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Something went wrong', error });
        }
    },
};