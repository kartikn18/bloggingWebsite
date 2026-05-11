import { Request,Response,NextFunction } from "express";
import {ZodSchema} from "zod";

export const validate = (schema:ZodSchema)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        try {
            const validateData = schema.parse(req.body);
            req.body = validateData;
            next();
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message:error.message});
            }
            return res.status(400).json({message:"Invalid request data"});
        }
    }
}