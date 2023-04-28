import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { IConnectPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";

export type Data = {
  success: boolean;
  hasLiked?: boolean;
  likes?: IConnectPost["likes"];
  likeCount?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method } = req;
  const { pid } = req.query;

  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });
  const { _id } = user;

  switch (method) {
    /**
     * @route   GET api/users/[uid]/platforms/connect/posts/:pid/likes
     * @desc    Get a user's post's likes
     * @access  Public
     * @params  pid: string (required)
     **/
    case "GET":
      try {
        const post: IConnectPost | null = await Post.findOne<IConnectPost>({
          _id: pid,
        });
        if (!post) return res.status(404).json({ success: false });

        const likeCount = post.likes.length;
        const likes = post.likes;
        const hasLiked = likes!.some(
          (like) => String(_id) === String(like.user_id)
        );

        res.status(200).json({ success: true, hasLiked, likeCount, likes });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route    POST api/platforms/connect/posts/:pid/likes
     * @desc     Like a post
     * @access   Private
     * @body     none
     * @returns  likes: [{ user_id: string}]
     *           likeCount: number
     *           success: boolean
     *           error?: string
     **/
    case "POST":
      try {
        const { _id: user_id } = user;

        const post: IConnectPost | null = await Post.findOne<IConnectPost>({
          _id: pid,
        });
        if (!post) return res.status(404).json({ success: false });

        // Check if user has already liked the post
        const likeIndex = post.likes.findIndex((like) =>
          user_id.equals(like.user_id)
        );
        if (likeIndex !== -1) {
          return res.status(400).json({
            success: false,
            error: "You have already liked this post",
          });
        }

        // Add like to post
        post.likes.push({ user_id });
        await post.save();

        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * route    DELETE api/platforms/connect/posts/:pid/likes
     * desc     Unlike a post
     * access   Private
     * body     none
     * returns  success: boolean
     *          error?: string
     **/
    case "DELETE":
      try {
        const { _id: user_id } = user;

        const post: IConnectPost | null = await Post.findOne<IConnectPost>({
          _id: pid,
        });
        if (!post) return res.status(404).json({ success: false });

        // Check if user has not liked the post
        const likeIndex = post.likes.findIndex((like) =>
          user_id.equals(like.user_id)
        );
        if (likeIndex === -1) {
          return res.status(400).json({
            success: false,
            error: "You have not liked this post",
          });
        }

        // Remove like from post
        post.likes.splice(likeIndex, 1);
        await post.save();

        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
  }
}
