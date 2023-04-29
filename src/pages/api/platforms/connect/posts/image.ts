import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { uploadFileToS3 } from "@/lib/amazon-s3";
import formidable from "formidable";
import fs from "fs";
import { parseForm } from "@/lib/parseForm";

type PostData = {
  success: boolean;
  signedUrl?: string;
  filename?: string;
  error?: string;
};

type formidableData = {
  fields: formidable.Fields;
  files: formidable.Files;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostData>
) {
  await connectDB();
  const { method } = req;

  const user = await getAuthUser(req, res);
  if (!user)
    return res.status(401).json({ success: false, error: "Not authorized" });

  switch (method) {
    case "POST":
      try {
        const { files }: formidableData = await parseForm(req);
        const parsedFile: formidable.File = files.file as formidable.File;
        const url: string = parsedFile.filepath;
        const buffer: Buffer = fs.readFileSync(url);

        let signedUrl: string = await uploadFileToS3(
          buffer,
          parsedFile.originalFilename!
        );
        signedUrl = signedUrl.split("?")[0];

        res.status(200).json({
          success: true,
          signedUrl,
          filename: parsedFile.originalFilename!,
        });
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
