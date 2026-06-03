import { PostModel } from "../models/posts.model";
import { posts } from "../types/posts.types";

export const PostsService = {
    async createpost(postype: posts, userid: number, imageurl: string) {
        const post = await PostModel.createpost(
            userid,
            postype.title,
            postype.content,
            postype.images as number
        );
        // Link the image to this post's id
        const postimageurl = post
            ? await PostModel.postimagesurl(post.id, imageurl)
            : null;
        return { post, postimageurl };
    },

    async updatepost(postid: number, postype: posts) {
        return await PostModel.updatepost(postid, postype.title, postype.content);
    },

    async likepost(postid: number, userid: number) {
        return await PostModel.likepost(postid, userid);
    },

    async getallposts() {
        return await PostModel.getallposts();
    },

    async dashboardposts(userid: number) {
        return await PostModel.dashboardposts(userid);
    },
};