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
  const { method } = req;
  await connectDB();

  switch (method) {
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
    case "PUT":
      try {
        // Authenticate user
        const user = await getAuthUser(req, res);
        if (!user) return res.status(401).json({ success: false });
        const { _id: user_id } = user;

        // Params
        const { pid } = req.query;
        const { visibility, title, community_id, content } = req.body;

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
            visibility,
            title,
            community_id,
            content,
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
