import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}
export const middleare = {
    async islogin(req:Request,res:Response,next:NextFunction){
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({message:'Unauthorized'})
        }
        try {
            const verify = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
            req.user = { id: verify.id };
            next();
        } catch (error) {
            return res.status(401).json({message:'Unauthorized'})
        }
    }
}
