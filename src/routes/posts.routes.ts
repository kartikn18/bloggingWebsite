import { Router } from 'express';
import { postController } from '../controller/posts.controller';
import { middleare } from '../middleware/islogin';
import { multerConfig } from '../config/multer';

const postsRouter = Router();

postsRouter.get('/', postController.getposts);
postsRouter.get('/mine', middleare.islogin, postController.dashboardposts);
postsRouter.post(
  '/createPost',
  middleare.islogin,
  multerConfig.array('images', 5),
  postController.createPost
);
postsRouter.put('/updatePost/:id', middleare.islogin, postController.updatePost);
postsRouter.post('/likePost/:id', middleare.islogin, postController.likePost);

export default postsRouter;