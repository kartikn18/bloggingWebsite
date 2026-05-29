//create posts 
//update posts
//delete posts 
//likes in the posts
import { PostModel } from "../models/posts.model";
import { posts } from "../types.ts/posts.types";
export const PostsService = {
    async createpost(postype:posts,userid:number,imageurl:string){
        const post = await PostModel.createpost(userid,postype.title,postype.content,postype.images as number);
        const postimageurl = await PostModel.postimagesurl(imageurl);
        return { post, postimageurl };
    },
    //update post :
    async updatepost(postid:number,postype:posts){
        const updatepost  = await PostModel.updatepost(postid,postype.title,postype.content,postype.images as number);
        return updatepost;
    },
    async likepost(postid:number){
        const likeesport = await PostModel.likepost(postid);
        return likeesport;
    },
    async getallposts(){
        return await PostModel.getallposts();
    },
    
}