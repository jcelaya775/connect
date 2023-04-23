import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { uploadFileToS3 } from "@/lib/amazon-s3";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import Post, { IPost } from "@/models/Post";
import { parseForm } from "@/lib/parseForm";

// IMPORTANT: Prevents next from trying to parse the form
export const config = {
  api: {
    bodyParser: false,
  },
};
type formidableData = {
  fields: formidable.Fields;
  files: formidable.Files;
};
interface uploadFile {
  success: boolean;
  signedUrl?: string;
  message: string;
  key?: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case "GET": {
      const data = req.query.data;
      res.status(200).json({ success: true, httpStatus: "200", data: data });
    }
    case "POST": {
      try {
        //grab the file and fields
        const { fields, files }: formidableData = await parseForm(req);
        const {
          username,
          email,
          body,
          user_id,
          community_id,
          main_platform,
          facebook_post_id,
          instagram_post_id,
          visibility,
          link,
        }: formidable.Fields = fields;
        const parsedFile: formidable.File = files.file as formidable.File;

        //if there is a file, grab data
        if (parsedFile) {
          // Create image post
          console.log("creating image");
          const url: string = parsedFile.filepath;
          const buffer: Buffer = fs.readFileSync(url);
          const formData: FormData = new FormData();
          let signedURL: string = "";
          console.log("appending data");
          if (facebook_post_id)
            formData.append("facebook_post_id", facebook_post_id);
          if (instagram_post_id)
            formData.append("instagram_post_id", instagram_post_id);
          if (body) formData.append("body", body);
          if (community_id) formData.append("community_id", community_id);
          if (link) formData.append("link", link);

          formData.append("username", username);
          formData.append("user_id", user_id);
          console.log("user_id appended");
          console.log("community id appended");
          formData.append("main_platform", main_platform);
          formData.append("email", email);
          formData.append("visibility", visibility);
          console.log("form data appended");

          if (buffer) {
            formData.append("source", buffer, {
              filename: url,
              contentType: "image/jpeg",
            });
            signedURL = await uploadFileToS3(
              buffer,
              parsedFile.originalFilename!
            );
            console.log("before new post");
            const newPost: IPost = new Post({});
          } else {
            res.status(400).json({
              success: false,
              error: "Could not parse buffer from file",
            });
          }
          if (signedURL === "") {
            res
              .status(400)
              .json({ status: false, message: "could not upload to S3" });
          }
          const newPost: IPost = new Post({
            user_id: user_id,
            username: username,
            email: email,
            community_id: community_id,
            main_platform: main_platform,
            platforms: [facebook_post_id, instagram_post_id],
            content: {
              body: body,
            },
            visibility: visibility,
          });
          newPost.save((err, post) => {
            if (err) {
              console.error("Error saving post:", err);
              res.status(500).json({
                success: false,
                err: "unable to save post to MongoDB",
              });
            } else {
              console.log("Post saved successfully:", post);
            }
          });
          res.status(200).json({
            status: true,
            Post: newPost,
          });
        } else {
        }
      } catch (err) {
        res
          .status(401)
          .json({ status: false, message: "could not parse file" });
      }
    }
  }
}
