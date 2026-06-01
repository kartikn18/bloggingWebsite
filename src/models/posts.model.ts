import { db } from "../config/db";

// create posts of the user 
export const PostModel={
    async createpost (userid:number,title:string,content:string,images:number){
        const post = await db.insertInto('POST').values({
            user_id:userid,
            title,
            content,
            images
        } as any).returningAll().executeTakeFirst();
        return post;
    },
    async updatepost(postid:number,title:string,content:string){
        const post = await db.updateTable('POST').set({
            title,
            content,
        } as any).where('id', '=', postid).returningAll().executeTakeFirst();
        return post;
    },
    // do liking th posts of the posts
    async likepost(postid:number){
       const post = await db.updateTable('POST').set((eb)=>({
        likes:eb('likes', '+', 1)
       } as any)).where ('id', '=', postid).returningAll().executeTakeFirst();
       return post;
    },
   // see all posts home page of posts 
   async getallposts(){
    const posts = await db
      .selectFrom('POST')
      .innerJoin('USER', 'USER.id', 'POST.user_id')
      .select([
        'POST.id',
        'POST.user_id',
        'POST.title',
        'POST.content',
        'POST.likes',
        'POST.images',
        'POST.created_at',
        'POST.updated_at',
        'USER.username',
      ])
      .orderBy('POST.created_at', 'desc')
      .execute();
    return posts;
   },
   // postimages_url of the posts in the db 
   async postimagesurl(imageurl:string){
    const posturl = await db.insertInto('BLOGSIMAGES_URL').values({
        imageurl
    } as any).returningAll().executeTakeFirst();
    return posturl;
   },
   async dashboardposts(userid:number){
    const posts = await db.selectFrom('POST').selectAll().where('user_id', '=', userid).orderBy('created_at','desc').execute();
    return posts;
   }
    }




