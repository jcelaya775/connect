import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { uploadFileToS3, deleteFileFromS3 } from "@/lib/amazon-s3";
import formidable from "formidable";
import fs from "fs";
import { parseForm } from "@/lib/parseForm";
import Post, { IConnectPost } from "@/models/Post";

type PutData = {
  success: boolean;
  signedUrl?: string;
  filename?: string;
  error?: string;
};

type DeleteData = {
  success: boolean;
  error?: string;
};

type formidableData = {
  fields: formidable.Fields;
  files: formidable.Files;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PutData | DeleteData>
) {
  await connectDB();
  const { method } = req;

  const user = await getAuthUser(req, res);
  if (!user)
    return res.status(401).json({ success: false, error: "Not authorized" });

  switch (method) {
    case "PUT":
      console.log("PUT /api/platforms/connect/posts/image");
      try {
        const { pid } = req.query;
        const { files }: formidableData = await parseForm(req);
        const parsedFile: formidable.File = files.file as formidable.File;
        const url: string = parsedFile.filepath;
        const buffer: Buffer = fs.readFileSync(url);

        console.log("parsedFile", parsedFile);
        console.log("url", url);
        console.log("buffer", buffer);

        // Delete current image
        const post: IConnectPost | null = await Post.findById(pid);

        if (!post)
          return res
            .status(404)
            .json({ success: false, error: "Post not found" });
        if (String(post.user_id) !== String(user._id))
          return res
            .status(401)
            .json({ success: false, error: "Unauthorized" });

        const { image } = post.content;

        const deletedFileName = image?.filename;
        if (deletedFileName) {
          const deleted: boolean = await deleteFileFromS3(deletedFileName);
          if (!deleted)
            return res.status(500).json({
              success: false,
              error: "Server error in deleteing the file",
            });
        }

        // Update image
        let signedUrl: string = await uploadFileToS3(
          buffer,
          parsedFile.originalFilename!
        );
        signedUrl = signedUrl.split("?")[0];
        post.content.image = {
          filename: parsedFile.originalFilename!,
          signedUrl,
        };

        await post.save();

        res.status(200).json({
          success: true,
          signedUrl,
          filename: parsedFile.originalFilename!,
        });
      } catch (err) {
        res.status(401).json({ success: false, error: "could not parse file" });
      }

      break;
    case "DELETE":
      try {
        const { pid } = req.query;

        const post: IConnectPost | null = await Post.findById(pid);

        if (!post)
          return res
            .status(404)
            .json({ success: false, error: "Post not found" });
        if (String(post.user_id) !== String(user._id))
          return res
            .status(401)
            .json({ success: false, error: "Unauthorized" });

        const { image } = post.content;
        const filename = image?.filename;
        if (!filename)
          return res
            .status(403)
            .json({ success: false, error: "Post does not contain an image" });

        const deleted: boolean = await deleteFileFromS3(filename);
        if (!deleted)
          return res.status(500).json({
            success: false,
            error: "Server error in deleteing the file",
          });

        post.content.image = undefined;
        await post.save();

        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false });
      break;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
