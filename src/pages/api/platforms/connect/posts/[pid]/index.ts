import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { IConnectPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User";

type Data = {
  success: boolean;
  post?: IConnectPost & any;
  postId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method } = req;

  switch (method) {
    /*
     * @route   GET api/platforms/connect/posts/:pid
     * @desc    Get a post by id
     * @access  Public
     * @params  pid: string (required)
     **/
    case "GET":
      // NOTE: This method is not authenticated
      try {
        const { pid } = req.query;

        // Get post with populated comments
        const post: IConnectPost | null = await Post.findOne<IConnectPost>({
          _id: pid,
        }); //.populate("comments.user_id", "name");
        if (!post)
          return res
            .status(404)
            .json({ success: false, error: "Post not found" });

        res.status(200).json({
          success: true,
          post,
        });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   PUT api/platforms/connect/posts/:pid
     * @desc    Update a post
     * @access  Private
     * @params  pid: string (required)
     * @body    title: string (optional)
     * @body    community_id: string (optional)
     * @body    content: string (optional)
     * @body    visibility: string (optional)
     **/
    case "PUT":
      try {
        // Authenticate user
        const user = await getAuthUser(req, res);
        if (!user) return res.status(401).json({ success: false });
        const { _id: user_id } = user;

        // Params
        const { pid } = req.query;
        const { community_id, content, visibility } = req.body;

        // Authorize user to edit post
        const post: IConnectPost | null = await Post.findOne<IConnectPost>({
          _id: pid,
        });
        if (!post) return res.status(404).json({ success: false });
        if (String(post.user_id) !== String(user_id))
          return res.status(401).json({ success: false });

        // Update post
        const updatedPost: IConnectPost | null =
          await Post.findOneAndUpdate<IConnectPost>(
            {
              _id: pid,
            },
            {
              // community_id,
              content,
              visibility,
            },
            {
              new: true,
            }
          );
        if (!updatedPost) return res.status(404).json({ success: false });

        // Return deleted post
        return res.status(200).json({ success: true, post: updatedPost });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   DELETE api/platforms/connect/posts/:pid
     * @desc    Delete a post
     * @access  Private
     * @params  pid: string (required)
     **/
    case "DELETE":
      try {
        // Authenticate user
        const user = await getAuthUser(req, res);
        if (!user) return res.status(401).json({ success: false });
        const { _id: user_id } = user;

        const { pid } = req.query;

        // Authorize user to delete post
        const post: IConnectPost | null = await Post.findOne<IConnectPost>({
          _id: pid,
        });
        if (!post) return res.status(404).json({ success: false });
        if (String(post.user_id) !== String(user_id))
          return res.status(401).json({ success: false });

        // Delete post
        const deletedPost: IConnectPost | null =
          await Post.findOneAndDelete<IConnectPost>({
            _id: pid,
          });
        if (!deletedPost) return res.status(404).json({ success: false });

        // Return deleted post
        res.status(200).json({ success: true, postId: deletedPost._id });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
