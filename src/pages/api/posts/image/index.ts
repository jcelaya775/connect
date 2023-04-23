import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { uploadFileToS3 } from "@/lib/amazon-s3";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
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
        console.log("pre-parse");
        const { fields, files }: formidableData = await parseForm(req);
        const { message, name, caption }: formidable.Fields = fields;
        const parsedFile: formidable.File = files.file as formidable.File;
        console.log("post-parse");
        let id: string, postId: string;

        if (parsedFile) {
          // Create image post
          console.log(`in if. file: ${parsedFile}`);
          const url: string = parsedFile.filepath;
          const buffer: Buffer = fs.readFileSync(url);
          const formData: FormData = new FormData();
          console.log("pre-data");

          formData.append("caption", caption);
          console.log("pre-buffer");
          formData.append("source", buffer, {
            filename: url,
            contentType: "image/jpeg",
          });
          console.log("post buffer");
          const signedURL = await uploadFileToS3(
            buffer,
            parsedFile.originalFilename!
          );
          console.log("signed");
          if (!signedURL) {
            res
              .status(400)
              .json({ status: false, message: "could not upload to S3" });
          }
          res.status(200).json({
            status: true,
            key: parsedFile.originalFilename,
            url: signedURL,
          });
        }
      } catch (err) {
        res
          .status(401)
          .json({ status: false, message: "could not parse file" });
      }
    }
  }
}
