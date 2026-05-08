import { Usermodel } from "../models/user.model";
import bcrypt from "bcrypt";
export const userServices = {
   async registeruser(email:string,username:string,password:string){
    //first check krega user existances ko email se 
    // phir user creat krne se pahle password hash kreaga
    //phir user create krke return krdega
    const existinguser = await Usermodel.getuserbyemail(email);
    if(existinguser){
        throw new Error ("User already exists");
    }
    const hashedpassword = await bcrypt.hash(password,10);
    const user = await Usermodel.createUser(email,username,hashedpassword);
    return user;
    },
async longinuser(email:string,password:string){
    //first check user existannce 
    //phir passwowrd match krne ke liye bcrypt compare use krenga
    //phir user retunr kredenga and login krgdenge

    const existing = await Usermodel.getuserbyemail(email);
    if (!existing){
        throw new Error ("User does not exist");
    }
    const ispsswordmatch = await bcrypt.compare(password,existing.password);
    if (!ispsswordmatch){
        throw new Error ("Invalid password");
    }
    return existing;
},
    
}