import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { IConnectPost } from "@/models/Post";
import Comment, { IComment } from "@/models/Comment";
import { getAuthUser } from "@/lib/auth";

type GetData = {
  success: boolean;
  comment?: IComment;
  comments?: IComment[];
  commentCount?: number;
  error?: string;
};

type PostData = {
  success: boolean;
  comment?: IComment;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetData | PostData>
) {
  await connectDB();
  const { method } = req;

  switch (method) {
    /**
     * @route   GET api/platforms/connect/posts/:pid/comments
     * @desc    Get all comments for a post
     * @access  Public
     * @params  pid: string (required)
     * @todo    Implement pagination
     **/
    case "GET":
      try {
        const { pid } = req.query;

        const url = process.env.NEXTAUTH_URL;
        const post: IConnectPost | null = await Post.findOne<IConnectPost>({
          _id: pid,
        });
        if (!post) return res.status(404).json({ success: false });

        const comments: IComment[] = post.comments ?? [];
        let commentCount: number = comments.length;
        for (const comment of comments) {
          const { data } = await axios.get(
            `${url}/api/platforms/connect/posts/${pid}/comments/${comment._id}`,
            {
              headers: {
                Cookie: req.headers.cookie,
              },
            }
          );
          const replies = comment.replies!;
          commentCount += replies.length;
        }

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
     * @route   POST api/platforms/connect/posts/:pid/comments
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

        const post: IConnectPost | null = await Post.findOne<IConnectPost>({
          _id: pid,
        });
        if (!post) {
          return res.status(404).json({ success: false });
        }

        const comment: IComment = await Comment.create({
          user_id,
          name: user.name,
          content,
        });

        post.comments!.push(comment);

        await post.save();

        res.status(200).json({ success: true, comment: comment });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
