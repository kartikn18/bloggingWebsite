import  Jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateRefreshToken = (payload:{
    id:number,
    email:string

})=>{
    const token = Jwt.sign(payload,process.env.JWT_SECRET as string,{expiresIn:'7d'});
    return token;
}
export const generateAccessToken =(payload:{
    id:number,
    email:string
})=>{
    const token = Jwt.sign(payload,process.env.JWT_SECRET as string,{expiresIn:'24h'});
    return token;   
}