import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Comment, { IComment } from "@/models/Comment";
import { getAuthUser } from "@/lib/auth";
import Post, { IConnectPost } from "@/models/Post";
import { ObjectId } from "mongoose";

type CommentData = {
  success: boolean;
  comment?: IComment;
  error?: string;
};

type ReplyData = {
  success: boolean;
  reply?: IComment;
  replies?: IComment[];
  error?: string;
};

const getRepliesHelper = async (comment: IComment): Promise<IComment[]> => {
  const replyIds: IComment[] = comment.replies ?? [];
  if (replyIds.length === 0) return [];

  const replies: IComment[] = await Comment.find({ _id: { $in: replyIds } });
  comment.replies = replies;

  // Get replies for each reply
  for (const reply of replies) {
    await getRepliesHelper(reply);
  }

  return replies;
};

const getReplies = async (comment: IComment): Promise<IComment[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const replies: IComment[] = await getRepliesHelper(comment);
      return resolve(replies);
    } catch (error) {
      reject(error);
    }
  });
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
     * @route   GET api/platforms/connect/posts/:pid/comments/:cid
     * @desc    Get all replies for a comment
     * @access  Public
     * @params  pid: string (required)
     * @params  cid: string (required)
     */
    case "GET":
      try {
        const { cid } = req.query;

        const comment: IComment | null = await Comment.findOne<IComment>({
          _id: cid,
        });
        if (!comment) return res.status(404).json({ success: false });

        console.log("getting replies");
        const replies: IComment[] = await getReplies(comment);
        console.log(replies);

        res.status(200).json({ success: true, replies });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   POST api/platforms/connect/posts/:pid/comments/:cid
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
     * @route   PUT api/platforms/connect/posts/:pid/comments/:cid
     * @desc    Edit a comment
     * @access  Private
     * @params  cid: string (required)
     * @body    content: string (required)
     **/
    case "PUT":
      try {
        const { cid } = req.query;
        const { content } = req.body;

        const comment: IComment | null = await Comment.findOne<IComment>({
          _id: cid,
        });
        if (!comment) return res.status(404).json({ success: false });

        comment.content = content;

        await comment.save();

        res.status(200).json({ success: true, comment });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   DELETE api/platforms/connect/posts/:pid/comments/:cid
     * @desc    Delete a comment
     * @access  Private
     * @params  cid: string (required)
     **/
    case "DELETE":
      try {
        const { pid, cid } = req.query;

        const comment: IComment | null = await Comment.findById<IComment>(cid);
        if (comment) {
          console.log(comment);
          console.log(comment.user_id);
          if (String(comment.user_id) !== String(user_id))
            return res.status(401).json({ success: false });

          await comment.remove();
          return res.status(200).json({ success: true });
        }

        const post: IConnectPost | null = await Post.findById<IConnectPost>(
          pid
        );
        if (!post)
          return res
            .status(404)
            .json({ success: false, error: "Post not found" });

        if (
          post.comments?.some(
            (comment: IComment) => String(comment._id) === cid
          )
        ) {
          post.comments = post.comments?.filter(
            (comment: IComment) => String(comment._id) !== cid
          );
          await post.save();

          return res.status(200).json({ success: true });
        } else {
          return res
            .status(404)
            .json({ success: false, error: "Comment not found" });
        }
      } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
      }
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
