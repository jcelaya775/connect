import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { uploadFileToS3, updateFileOnS3 } from "@/lib/amazon-s3";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import { parseForm } from "@/lib/parseForm";
import { beTarask } from "date-fns/locale";

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
          parsedFile.originalFilename
        );

        res.status(200).json({
          success: true,
          signedUrl,
          filename: parsedFile.originalFilename,
        });
      } catch (err) {
        res.status(500).json({ success: false, error: "Could not parse file" });
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
