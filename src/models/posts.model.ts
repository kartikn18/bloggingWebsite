import { db } from "../config/db";

// create posts of the user 
export const PostModel={
    async createpost (userid:number,title:string,content:string,images:number){
        const post = await db.insertInto('post').values({
            user_id:userid,
            title,
            content,
            images
        } as any).returningAll().executeTakeFirst();
        return post;
    },
    async updatepost(postid:number,title:string,content:string){
        const post = await db.updateTable('post').set({
            title,
            content,
        } as any).where('id', '=', postid).returningAll().executeTakeFirst();
        return post;
    },
    // do liking th posts of the posts
    async likepost(postid:number){
       const post = await db.updateTable('post').set((eb)=>({
        likes:eb('likes', '+', 1)
       } as any)).where ('id', '=', postid).returningAll().executeTakeFirst();
       return post;
    },
   // see all posts home page of posts 
   async getallposts(){
    const posts = await db
      .selectFrom('post')
      .innerJoin('users', 'users.id', 'post.user_id')
      .select([
        'post.id',
        'post.user_id',
        'post.title',
        'post.content',
        'post.likes',
        'post.images',
        'post.created_at',
        'post.updated_at',
        'users.username',
      ])
      .orderBy('post.created_at', 'desc')
      .execute();
    return posts;
   },
   // postimages_url of the posts in the db 
   async postimagesurl(imageurl:string){
    const posturl = await db.insertInto('blogsimages_url').values({
        image_url:imageurl,
    } as any).returningAll().executeTakeFirst();
    return posturl;
   },
   async dashboardposts(userid:number){
    const posts = await db.selectFrom('post').selectAll().where('user_id', '=', userid).orderBy('created_at','desc').execute();
    return posts;
   }
    }




