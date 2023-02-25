import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/connectDB";
import User, { IUser } from "@/models/User";
import Post, { IPost } from "@/models/Post";

//NextApiRequest should contain the post to be added to the database
type Data = {
  success: boolean;
  status: string;
  error?: string;
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
        const { username, _id } = req.body;
        const post: IPost | null = await Post.findOne({ username, _id });
        if (!post) {
          res.status(404).json({ success: false, status: "Not Found" });
          break;
        }
        let _likes: number = post.likes;
        res.status(200).json({
          success: true,
          status: "OK",
          likes: _likes,
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, status: "Bad Request" });
      }
      break;
    case "PUT":
      const { username, _id, _likes } = req.body;
      const post: IPost | null = await Post.findOne({ username, _id });
      if (!post) {
        res.status(404).json({ success: false, status: "Not Found" });
        break;
      }
      post.likes = _likes;
      post.save();
  }
}
