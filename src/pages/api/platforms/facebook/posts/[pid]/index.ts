import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import { getAuthUser } from "@/lib/auth";

type Data = {
  success: boolean;
  post?: any;
  postId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();

  const user = await getAuthUser(req, res);
  if (!user)
    return res.status(401).json({ success: false, error: "Not logged in" });
  if (!user.facebook?.page_token)
    return res
      .status(401)
      .json({ success: false, error: "Your Facebook page is not connected" });
  const { page_token } = user.facebook;

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { pid } = req.query;

        const fields: string =
          "id, created_time, message, full_picture, admin_creator, shares, story, subscribed, to, updated_time";
        const response = await axios.get(
          `https://graph.facebook.com/v16.0/${pid}?fields=${fields}&access_token=${page_token}`
        );
        const post = response.data;

        res.status(200).json({ success: true, post });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }

      break;
    case "PUT":
      try {
        const { pid } = req.query;
        const { message } = req.body;

        const response = await axios.post(
          `https://graph.facebook.com/v16.0/${pid}?access_token=${page_token}`,
          {
            message,
          }
        );
        const post = response.data;

        res.status(200).json({ success: true, post });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }

      break;
    case "DELETE":
      try {
        const { pid } = req.query;

        const response = await axios.delete(
          `https://graph.facebook.com/v16.0/${pid}?access_token=${page_token}`
        );
        const post = response.data;
        const postId = post.id;

        res.status(200).json({ success: true, postId });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
