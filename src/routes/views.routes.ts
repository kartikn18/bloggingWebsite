import { Router, Request, Response } from 'express';

export const viewsRouter = Router();

viewsRouter.get('/', (_req: Request, res: Response) => {
  res.redirect('/login-page');
});

viewsRouter.get('/login-page', (_req: Request, res: Response) => {
  res.render('login', { title: 'Login' });
});

viewsRouter.get('/signup-page', (_req: Request, res: Response) => {
  res.render('signup', { title: 'Sign Up' });
});

viewsRouter.get('/dashboard', (_req: Request, res: Response) => {
  res.render('dashboard', { title: 'Dashboard' });
});

viewsRouter.get('/profile-page', (_req: Request, res: Response) => {
  res.render('profile', { title: 'Profile' });
});
