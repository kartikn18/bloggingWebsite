import {Request,Response,NextFunction} from "express";
import {redis} from '../config/redis';
const MAX_ATTEMPTS = 3;
const windowsize = 5*60;
 export   const  loginattempts =  async (req:Request,res:Response,next:NextFunction)=>{
    //ip adreess lenge ot usee redis me store krenge with count and time
    //windowsize 5 min and lax login attempts 3
  try {
   const ip = req.ip;
   const blockedip = `blocked:${ip}`;
   const isblocked = await redis.get(blockedip);
   if(isblocked){
      return res.status(403).json({message:"Too many login attempts. Please try again later."});
   }
   next();

  } catch(error){
    console.error("Error in login attempts middleware:", error);
    res.status(500).json({message:"Internal server error"});
  };
    
   }
   

  
