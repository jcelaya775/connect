import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios from "axios";
import { getAuthUser } from "@/lib/auth";

type Data = {
  success: boolean;
  posts?: any[];
  postId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();

  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ success: false });
  const { page_token } = user.facebook;

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // TODO: add pagination
        const fields: string =
          "id, created_time, message, full_picture, admin_creator, shares, story, subscribed, to, updated_time";
        const response = await axios.get(
          `https://graph.facebook.com/v16.0/me/feed?fields=${fields}&access_token=${page_token}`
        );

        // Get user's posts
        // const posts = [];
        // let hasNextPage: boolean = true;
        // do {
        //   posts.push(...response.data.data);
        //   const nextPage: string = response.data.paging.cursors.after;
        //   const newPostResponse = await axios.get(nextPage);
        //   hasNextPage = newPostResponse.data.length > 0 ? true : false;
        // } while (hasNextPage);

        const posts = response.data.data;

        res.status(200).json({ success: true, posts });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const { page_id } = user.facebook;
        const { message } = req.body;

        const postResponse = await axios.post(
          `https://graph.facebook.com/${page_id}/feed`,
          {
            message,
            access_token: page_token,
          }
        );
        const postId: string = postResponse.data.id;

        res.status(200).json({ success: true, postId });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
