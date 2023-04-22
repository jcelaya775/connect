import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";

type Data = {
  success: boolean;
  data?: IPost;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method } = req;

  switch (method) {
    /**
     * @route   GET api/posts/:pid
     * @desc    Get a post by id
     * @access  Public
     * @params  pid: string (required)
     **/
    case "GET":
      // NOTE: This method is not authenticated
      try {
        const { pid } = req.query;

        // Get post
        const post: IPost | null = await Post.findOne<IPost>({ _id: pid });
        if (!post) return res.status(404).json({ success: false });

        res.status(200).json({
          success: true,
          data: post,
        });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   PUT api/posts/:pid
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
        const post: IPost | null = await Post.findOne<IPost>({ _id: pid });
        if (!post) return res.status(404).json({ success: false });
        if (String(post.user_id) !== String(user_id))
          return res.status(401).json({ success: false });

        // Update post
        const updatedPost: IPost | null = await Post.findOneAndUpdate<IPost>(
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
        return res.status(200).json({ success: true, data: updatedPost });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   DELETE api/posts/:pid
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
        const post: IPost | null = await Post.findOne<IPost>({ _id: pid });
        if (!post) return res.status(404).json({ success: false });
        if (String(post.user_id) !== String(user_id))
          return res.status(401).json({ success: false });

        // Delete post
        const deletedPost: IPost | null = await Post.findOneAndDelete<IPost>({
          _id: pid,
        });
        if (!deletedPost) return res.status(404).json({ success: false });

        // Return deleted post
        res.status(200).json({ success: true, data: deletedPost });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
