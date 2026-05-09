import { userServices } from "../services/user.services";
import {Request,Response} from "express";

export const usercontroller = {
    async registeruser(req:Request,res:Response){
        const {email,username,password } = req.body;
        try {
            const user = await userServices.registeruser(email,username,password);
            res.status(201).json(user).statusMessage = " REGISTERED:User registered successfully";
        
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }

    },
    async loginuser(req:Request,res:Response){
        const {email,password} = req.body;
        try {
            const {existing,refreshtoken,accesstoken} = await userServices.loginuser(email,password);
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,
                sameSite:'strict',
                secure:true,
                maxAge:7*24*60*60*1000
            })
            res.status(200).json({user:existing,accesstoken}).statusMessage = " LOGIEDIN:User logged in successfully";
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}