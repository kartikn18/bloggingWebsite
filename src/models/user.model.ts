import {db} from "../config/db"

export const Usermodel = {
async createUser(email:string,username:string,password:string){
    const user = await db.insertInto('users').values({
        email,
        username,
        password_hash:password
    } as any).returningAll().executeTakeFirst();
    return user;
},
async getuserbyemail(email:string){
    const user = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
    return user;
},

    }