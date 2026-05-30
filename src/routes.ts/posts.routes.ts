import {Router} from 'express';
import {postController} from '../controller/posts.controller';
import {middleare} from '../middleware/islogin';
const postsRouter = Router();

postsRouter.post('/createPost',middleare.islogin,postController.createPost);
postsRouter.put('/updatePost/:id',middleare.islogin,postController.updatePost);
postsRouter.post('/likePost/:id',middleare.islogin,postController.likePost);

export default postsRouter;