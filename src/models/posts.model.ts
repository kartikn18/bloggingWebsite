import { db } from "../config/db";

export const PostModel = {
    async createpost(userid: number, title: string, content: string, images: number) {
        const post = await db.insertInto('post').values({
            user_id: userid,
            title,
            content,
            images,
        } as any).returningAll().executeTakeFirst();
        return post;
    },

    async updatepost(postid: number, title: string, content: string) {
        const post = await db.updateTable('post').set({
            title,
            content,
        } as any).where('id', '=', postid).returningAll().executeTakeFirst();
        return post;
    },

    async likepost(postid: number, userid: number) {
        // Check if this user already liked this post
        const existing = await db
            .selectFrom('likes')
            .selectAll()
            .where('post_id', '=', postid)
            .where('user_id', '=', userid)
            .executeTakeFirst();

        if (existing) {
            // Unlike: remove the row, decrement count
            await db.deleteFrom('likes')
                .where('post_id', '=', postid)
                .where('user_id', '=', userid)
                .execute();
            const post = await db.updateTable('post')
                .set((eb) => ({ likes: eb('likes', '-', 1) } as any))
                .where('id', '=', postid)
                .returningAll()
                .executeTakeFirst();
            return { post, liked: false };
        } else {
            // Like: insert the row, increment count
            await db.insertInto('likes')
                .values({ post_id: postid, user_id: userid } as any)
                .execute();
            const post = await db.updateTable('post')
                .set((eb) => ({ likes: eb('likes', '+', 1) } as any))
                .where('id', '=', postid)
                .returningAll()
                .executeTakeFirst();
            return { post, liked: true };
        }
    },

    async getallposts() {
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

        // Attach the first image URL per post
        const postIds = posts.map((p) => p.id);
        const imageRows = postIds.length
            ? await db
                .selectFrom('blogsimages_url')
                .select(['post_id', 'image_url'])
                .where('post_id', 'in', postIds)
                .execute()
            : [];

        const imageMap: Record<number, string> = {};
        for (const row of imageRows) {
            if (!imageMap[row.post_id]) imageMap[row.post_id] = row.image_url;
        }

        return posts.map((p) => ({ ...p, image_url: imageMap[p.id] ?? null }));
    },

    async postimagesurl(postid: number, imageurl: string) {
        const posturl = await db.insertInto('blogsimages_url').values({
            post_id: postid,
            image_url: imageurl,
        } as any).returningAll().executeTakeFirst();
        return posturl;
    },

    async dashboardposts(userid: number) {
        const posts = await db
            .selectFrom('post')
            .selectAll()
            .where('user_id', '=', userid)
            .orderBy('created_at', 'desc')
            .execute();

        const postIds = posts.map((p) => p.id);
        const imageRows = postIds.length
            ? await db
                .selectFrom('blogsimages_url')
                .select(['post_id', 'image_url'])
                .where('post_id', 'in', postIds)
                .execute()
            : [];

        const imageMap: Record<number, string> = {};
        for (const row of imageRows) {
            if (!imageMap[row.post_id]) imageMap[row.post_id] = row.image_url;
        }

        return posts.map((p) => ({ ...p, image_url: imageMap[p.id] ?? null }));
    },
};