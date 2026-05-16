//create posts 
//update posts
//delete posts 
//likes in the posts
import { PostModel } from "../models/posts.model";
import { posts } from "../types.ts/posts.types";
export const PostsService = {
    async createpost(postype:posts,userid:number){
        const post = await PostModel.createpost(userid,postype.title,postype.content,postype.images.length);
        return post;
    },
    //update post :
    async updatepost(postid:number,postype:posts){
        const updatepost  = await PostModel.updatepost(postid,postype.title,postype.content,postype.images.length);
        return updatepost;
    }
}