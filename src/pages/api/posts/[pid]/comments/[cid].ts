import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Comment, { IComment } from "@/models/Comment";
import { getAuthUser } from "@/lib/auth";

type CommentData = {
  success: boolean;
  data?: IComment;
  error?: string;
};

type ReplyData = {
  success: boolean;
  data?: IComment[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentData | ReplyData>
) {
  await connectDB();
  const { method } = req;

  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });
  const { _id: user_id } = user;

  switch (method) {
    /**
     * @route   GET api/posts/:pid/comments/:cid
     * @desc    Get all replies for a comment
     * @access  Public
     * @params  pid: string (required)
     * @params  cid: string (required)
     */
    case "GET":
      try {
        const { pid, cid } = req.query;

        const comment: IComment | null = await Comment.findOne<IComment>({
          _id: cid,
        });
        if (!comment) return res.status(404).json({ success: false });

        const replies: IComment[] = comment.replies ?? [];

        res.status(200).json({ success: true, data: replies });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   POST api/posts/:pid/comments/:cid
     * @desc    Create a reply to a comment
     * @access  Private
     * @params  cid: string (required)
     * @body    content: string (required)
     **/
    case "POST":
      try {
        const { pid, cid } = req.query;
        const { content } = req.body;

        // const comment: IComment | null = await Comment.findOne<IComment>({
        //   _id: cid,
        // });
        // if (!comment) return res.status(404).json({ success: false });

        const post: IPost | null = await Post.findOne<IPost>({ _id: pid });
        if (!post) return res.status(404).json({ success: false });

        const comment = post.comments?.find((c) => c._id == cid);

        const reply: IComment = await Comment.create<IComment>({
          post_id: pid,
          parent_id: cid,
          user_id,
          content,
        });

        await reply.save();

        comment.replies?.push(reply._id);
        await comment.save();
        console.log(comment.replies);

        console.log(reply);
        res.status(200).json({ success: true, data: reply });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   PUT api/posts/:pid/comments/:cid
     * @desc    Edit a comment
     * @access  Private
     * @params  cid: string (required)
     * @body    content: string (required)
     **/
    case "PUT":
      try {
        const { pid, cid } = req.query;
        const { content } = req.body;

        const comment: IComment | null = await Comment.findOne<IComment>({
          _id: cid,
        });
        if (!comment) return res.status(404).json({ success: false });

        comment.content = content;

        await comment.save();

        res.status(200).json({ success: true, data: comment });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   DELETE api/posts/:pid/comments/:cid
     * @desc    Delete a comment
     * @access  Private
     * @params  cid: string (required)
     **/
    case "DELETE":
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
