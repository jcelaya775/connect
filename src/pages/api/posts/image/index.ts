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
          message,
          username,
          body,
          user_id,
          author,
          community_id,
          main_platform,
          facebook_post_id,
          visibility,
          link,
        }: formidable.Fields = fields;
        const parsedFile: formidable.File = files.file as formidable.File;
        let id: string, postId: string;

        //if there is a file, grab data
        if (parsedFile) {
          // Create image post
          const url: string = parsedFile.filepath;
          const buffer: Buffer = fs.readFileSync(url);
          const formData: FormData = new FormData();
          let signedURL: string = "";
          formData.append("message", message);
          formData.append("username", username);
          formData.append("body", body);
          formData.append("user_id", user_id);
          formData.append("author", author);
          formData.append("community_id", community_id);
          formData.append("main_platform", main_platform);
          formData.append("facebook_post_id", facebook_post_id);
          formData.append("visibility", visibility);
          formData.append("link", link);
          if (buffer) {
            formData.append("source", buffer, {
              filename: url,
              contentType: "image/jpeg",
            });
            signedURL = await uploadFileToS3(
              buffer,
              parsedFile.originalFilename!
            );
            const newPost: IPost = new Post({});
          } else {
            res
              .status(400)
              .json({
                success: false,
                error: "Could not parse buffer from file",
              });
          }
          if (signedURL === "") {
            res
              .status(400)
              .json({ status: false, message: "could not upload to S3" });
          }
          res.status(200).json({
            status: true,
            key: parsedFile.originalFilename,
            url: signedURL,
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
