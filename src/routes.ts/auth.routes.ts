import { Router } from "express";
import { usercontroller } from "../controller/user.controller";
import { loginattempts } from "../middleware/loginattempts";
import { registerschema } from "../types.ts/auth.types"
import { validate } from "../middleware/validate";
export const authroutes = Router();

authroutes.post('/register',validate(registerschema),usercontroller.registeruser);
authroutes.post('/login',loginattempts,usercontroller.loginuser);