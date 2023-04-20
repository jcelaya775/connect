import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import Comment, { IComment } from "@/models/Comment";
import { getAuthUser } from "@/lib/auth";

type GetData = {
  success: boolean;
  comments?: IComment[];
  commentCount?: number;
  error?: string;
};

type PostData = {
  success: boolean;
  data?: IComment;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetData | PostData>
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    /**
     * @route   GET api/posts/:pid/comments
     * @desc    Get all comments for a post
     * @access  Public
     * @params  pid: string (required)
     * @todo    Implement pagination
     **/
    case "GET":
      try {
        const { pid } = req.query;

        const post: IPost | null = await Post.findOne<IPost>({ _id: pid });
        if (!post) return res.status(404).json({ success: false });

        const comments: IComment[] = post.comments ?? [];
        const commentCount = comments.length;

        res.status(200).json({
          success: true,
          commentCount,
          comments,
        });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    /**
     * @route   POST api/posts/:pid/comments
     * @desc    Create a comment for a post
     * @access  Private
     * @params  comment: string (required)
     * @body    content: string (required)
     **/
    case "POST":
      try {
        const user = await getAuthUser(req, res);
        if (!user) return res.status(401).json({ success: false });
        const { _id: user_id } = user;

        const { pid } = req.query;
        const { content } = req.body;

        const post: IPost | null = await Post.findOne<IPost>({ _id: pid });
        if (!post) {
          return res.status(404).json({ success: false });
        }

        const comment: IComment = await Comment.create({
          post_id: pid,
          user_id,
          content,
        });

        post.comments!.push(comment);

        await post!.save();
        res.status(200).json({ success: true, data: comment });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
