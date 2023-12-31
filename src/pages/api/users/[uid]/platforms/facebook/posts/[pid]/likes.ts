import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import { getAuthUser } from "@/lib/auth";
import { ObjectId } from "mongoose";
import User, { IUser } from "@/models/User";

export type Data = {
  success: boolean;
  hasLiked?: boolean;
  likes?: ObjectId[];
  likeCount?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method } = req;

  const { uid } = req.query;
  const user: IUser | null | void = await User.findById(uid);
  if (!user)
    return res.status(404).json({ success: false, error: "User not found" });
  if (!user.facebook?.page_token)
    return res
      .status(401)
      .json({ success: false, error: "Your Facebook page is not connected" });
  const { page_token } = user.facebook;

  switch (method) {
    case "GET":
      try {
        const { pid } = req.query;
        const response = await axios.get(
          `https://graph.facebook.com/v16.0/${pid}/likes?summary=true&access_token=${page_token}`
        );
        const likes = response.data.data;
        let likeCount = response.data.data.length;
        const hasLiked = response.data.summary.has_liked;
        if (hasLiked) likeCount++;

        res.status(200).json({ success: true, hasLiked, likes, likeCount });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }

      break;
    case "POST":
      try {
        const { pid } = req.query;

        const response = await axios.post(
          `https://graph.facebook.com/v16.0/${pid}/likes?access_token=${page_token}`
        );

        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }

      break;
    case "DELETE":
      try {
        const { pid } = req.query;

        const response = await axios.delete(
          `https://graph.facebook.com/v16.0/${pid}/likes?access_token=${page_token}`
        );

        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
