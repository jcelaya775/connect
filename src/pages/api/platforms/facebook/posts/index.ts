import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import axios, { AxiosResponse } from "axios";
import { getAuthUser } from "@/lib/auth";
import formidable from "formidable";
import { parseForm } from "@/lib/parseForm";
import FormData from "form-data";
import fs from "fs";
import { IUser } from "@/models/User";
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

  const user: IUser | null | void = await getAuthUser(req, res);
  if (!user)
    return res.status(401).json({ success: false, error: "Unauthorized" });
  if (!user.facebook?.page_token)
    return res
      .status(401)
      .json({ success: false, error: "Your Facebook page is not connected" });

  switch (method) {
    case "GET":
      try {
        // TODO: add pagination
        const fields: string =
          "id, created_time, message, full_picture, admin_creator, shares, story, subscribed, to, updated_time";
        const response = await axios.get(
          `https://graph.facebook.com/v16.0/me/feed?fields=${fields}&access_token=${user.facebook.page_token}`
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
          post.user_id = user._id;
          post.author = user?.facebook?.page_name!;
        });

        res.status(200).json({ success: true, posts });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const { fields, files }: formidableData = await parseForm(req);
        const { message, caption }: formidable.Fields = fields;
        const file: formidable.File = files.file as formidable.File;

        let id: string, postId: string;
        if (file) {
          // Create image post
          const url: string = file.filepath;
          const buffer: Buffer = fs.readFileSync(url);
          const formData: FormData = new FormData();
          caption && formData.append("caption", caption);
          formData.append("source", buffer, {
            filename: url,
            contentType: "image/jpeg",
          });
          formData.append("access_token", user.facebook.page_token);

          const res: AxiosResponse = await axios.post(
            "https://graph.facebook.com/v16.0/me/photos",
            formData,
            { headers: { ...formData.getHeaders() } }
          );

          postId = res.data.id;
        } else {
          // Create text post
          const res: AxiosResponse = await axios.post(
            "https://graph.facebook.com/v16.0/me/feed",
            {
              message,
              access_token: user.facebook.page_token,
            }
          );

          postId = res.data.id;
        }

        res.status(200).json({ success: true, postId });
      } catch (error: any) {
        console.log(error);
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
