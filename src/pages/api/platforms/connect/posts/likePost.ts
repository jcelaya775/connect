import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/connectDB";
import User, { IUser } from "@/models/User";
import Post, { IPost } from "@/models/Post";
type Data = {
  success: boolean;
  status: string;
  likes?: number;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "GET":
      try {
        const { post_id } = req.query;

        const thisPost = Post.findOne({ post_id });
        if (!thisPost) {
          res.status(404).json({ success: false, status: "Post not found" });
          break;
        }
        const theseLikes = thisPost.likes;
        res
          .status(200)
          .json({ success: true, status: "OK", likes: theseLikes });
      } catch (err) {
        res.status(500).json({ success: false, status: "Error: " + err });
      }
    case "PUT":
      try {
        const { post_id, user_id } = req.query;
        const thisPost = await Post.findOne({ post_id });

        //if no post
        if (!thisPost) {
          res.status(404).json({ success: false, status: "Post not found" });
          break;
        }

        //check if liked by user
        const likedByUser = thisPost.liked_by.find({ user_id });
        if (!likedByUser) {
          thisPost.liked_by.push(user_id);
          thisPost.save();
          res.status(200).json({ success: true, status: "OK" });
          break;
        } else {
          res
            .status(403)
            .json({ success: false, status: "Post already liked" });
        }
      } catch (err) {
        res.status(500).json({ success: false, status: "Error: " + err });
      }
  }
}
