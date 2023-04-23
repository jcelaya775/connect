import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import { getAuthUser } from "@/lib/auth";
import { ObjectId } from "mongoose";

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

  const user = await getAuthUser(req, res);
  if (!user || !user.facebook?.page_token)
    return res.status(401).json({ success: false, error: "Not logged in" });
  const { page_token } = user.facebook;

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { pid } = req.query;

        const response = await axios.get(
          `https://graph.facebook.com/v16.0/${pid}/likes?summary=true&access_token=${page_token}`
        );
        const likes = response.data.data;
        const likeCount = response.data.data.length;
        const hasLiked = response.data.summary.has_liked;

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
