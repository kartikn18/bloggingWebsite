export type user = {
    id:number,
    username:string,
    email:string,
    password:string,
    created_at:Date,
    updated:Date
}
export type post = {
    id:number,
    user_id:number,
    likes:number,
    content:string,
    created_at: Date,
    updated_at:Date
}

export interface database {
USER :user,
POST :post
};