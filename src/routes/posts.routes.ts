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
  (req, res, next) => {
    multerConfig.array('images', 5)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  postController.createPost
);
postsRouter.put('/updatePost/:id', middleare.islogin, postController.updatePost);
postsRouter.post('/likePost/:id', middleare.islogin, postController.likePost);

export default postsRouter;