export type users = {
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
    title:string,
    images:number,
    content:string,
    created_at: Date,
    updated_at:Date
}
export type blogsimages_url = {
    id:number,
    post_id:number,
    images_url:string,
    creates_at:Date,
    updated_at:Date
}
export interface database {
USER :users,
POST :post,
BLOGSIMAGES_URL : blogsimages_url
};