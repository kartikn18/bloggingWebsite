import {Request,Response,NextFunction} from "express";
import redisclient from "../config/redis";
const MAX_ATTEMPTS = 3;
const windowsize = 5*60;
 export   const  loginattempts =  async (req:Request,res:Response,next:NextFunction)=>{
    //ip adreess lenge ot usee redis me store krenge with count and time
    //windowsize 5 min and lax login attempts 3
   const ip = req.ip;
   const blockedip = `block:${ip}`;
   const attemptskey = `attempts:${ip}`;
   const isblocked = await redisclient.exists(blockedip);
   if(isblocked){
    return res.status(403).json({message:"Too many login attempts. Try again later after 5 minutes."});
   }
   const attempts = await redisclient.incr(attemptskey);
   const key = Number(attempts);
   if(key==1){
    await redisclient.expire(attemptskey,windowsize);
   }
   if(key>MAX_ATTEMPTS){
    await redisclient.set(blockedip,'1','EX',windowsize);
    return res.status(403).json({message:"Too many login attempts. Try again later after 5 minutes."});
   }
   await redisclient.del(blockedip);
   await redisclient.del(attemptskey);
   next();
   return res.json({message:"Login attempt recorded"});
}
    
