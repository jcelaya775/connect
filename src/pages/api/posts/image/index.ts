import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { uploadFileToS3 } from "@/lib/amazon-s3";
import formidable from "formidable";
import fs from "fs";

// IMPORTANT: Prevents next from trying to parse the form
export const config = {
  api: {
    bodyParser: false,
  },
};
interface ParsedFile {
  filename: string | null;
  content: Buffer;
}
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
      const form = new formidable.IncomingForm();
      try {
        const parsedFile = await new Promise<ParsedFile>((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              console.error(err);
              reject(new Error("File upload failed"));
              return;
            }

            const file = files["file"] as formidable.File;

            if (!file) {
              reject(new Error("File not found"));
              return;
            }

            const content = fs.readFileSync(file.filepath);

            if (!content) {
              reject(new Error("Failed to read file content"));
              return;
            }

            const parsedFile: ParsedFile = {
              filename: file.originalFilename,
              content: content,
            };

            resolve(parsedFile);
          });
        });

        // Do something with the parsed file, e.g. upload to S3
        if (!parsedFile.filename || !parsedFile.content) {
          res
            .status(400)
            .json({ status: false, message: "File not parsed properly." });
        }

        const signedURL = await uploadFileToS3(
          parsedFile.content,
          parsedFile.filename!
        );
        if (!signedURL) {
          res
            .status(400)
            .json({ status: false, message: "could not upload to S3" });
        }
        res.status(200).json({ status: true, key: parsedFile.filename, url: signedURL });
      } catch (err) {
        res
          .status(401)
          .json({ status: false, message: "could not parse file" });
      }
    }
  }
}
