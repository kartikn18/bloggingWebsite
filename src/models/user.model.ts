import {db} from "../config/db"

export const Usermodel = {
async createUser(email:string,username:string,password:string){
    const user = await db.insertInto('USER').values({
        email,
        username,
        password
    } as any).returningAll().executeTakeFirst();
    return user;
},
async getuserbyemail(email:string){
    const user = await db.selectFrom('USER').selectAll().where('email', '=', email).executeTakeFirst();
    return user;
},

    }