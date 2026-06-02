import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const middleare = {
  async islogin(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;

    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accesstoken = auth.slice(7).trim();

    if (!accesstoken || accesstoken === 'null' || accesstoken === 'undefined') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    try {
      const payload = jwt.verify(accesstoken, secret) as {
        id: number;
        email: string;
      };
      req.user = { id: payload.id, email: payload.email };
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          message: 'Token expired. Please log in again.',
        });
      }
      return res.status(401).json({ message: 'Unauthorized' });
    }
  },
};
