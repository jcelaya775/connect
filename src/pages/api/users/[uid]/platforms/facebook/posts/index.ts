import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios, { AxiosResponse } from "axios";
import { getAuthUser } from "@/lib/auth";
import formidable from "formidable";
import { parseForm } from "@/lib/parseForm";
import FormData from "form-data";
import fs from "fs";
import User, { IUser } from "@/models/User";
import { platformTypes } from "@/types/platform";
import { IFacebookPost } from "@/types/post";

type GetData = {
  success: boolean;
  posts?: any[];
  postId?: string;
  error?: string;
};
type PostData = {
  success: boolean;
  id?: string;
  postId?: string;
  error?: string;
};
type formidableData = {
  fields: formidable.Fields;
  files: formidable.Files;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetData | PostData>
) {
  await connectDB();
  const { method }: { method?: string } = req;

  switch (method) {
    case "GET":
      try {
        const { uid }: { uid?: string } = req.query;
        const user: IUser | null | void = await User.findById(uid);

        if (!user)
          return res.status(404).json({
            success: false,
            error: "User not found",
          });
        if (!user.facebook?.page_token)
          return res.status(401).json({
            success: false,
            error:
              "The user first needs to connect their Facebook page to view their posts",
          });

        const page_token = user.facebook.page_token;

        // TODO: add pagination
        const fields: string =
          "id, created_time, message, full_picture, admin_creator, shares, story, subscribed, to, updated_time";
        const response = await axios.get(
          `https://graph.facebook.com/v16.0/me/feed?fields=${fields}&access_token=${page_token}`
        );

        const posts = response.data.data;
        // // Get user's posts
        // const posts = [];
        // let hasNextPage: boolean = true;
        // do {
        //   posts.push(...response.data.data);
        //   const nextPage: string = response.data.paging.cursors.after;
        //   const newPostResponse = await axios.get(nextPage);
        //   hasNextPage = newPostResponse.data.length > 0 ? true : false;
        // } while (hasNextPage);

        // const posts = response.data.data;
        posts.forEach((post: IFacebookPost) => {
          post.main_platform = platformTypes.facebook;
          post.author = user.facebook.page_name!;
        });

        res.status(200).json({ success: true, posts });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
