import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { uploadFileToS3, deleteFileFromS3 } from "@/lib/amazon-s3";
import formidable from "formidable";
import fs from "fs";
import { parseForm } from "@/lib/parseForm";

type Data = {
  success: boolean;
  profilePicture?: string;
  error?: string;
};

type formidableData = {
  fields: formidable.Fields;
  files: formidable.Files;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await connectDB();
  const { method } = req;

  const user = await getAuthUser(req, res);
  if (!user)
    return res.status(401).json({ success: false, error: "Unauthorized" });

  switch (method) {
    /*
     * @route   GET  api/settings/profile-picture
     * @desc    Get  user profile picture
     * @access  Public
     **/
    case "GET":
      try {
        res.status(200).json({
          success: true,
          profilePicture: user.profile_picture.signedUrl,
        });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    /**
     * @route   PUT    api/settings/profile-picture
     * @desc    Update user profile picture
     * @access  Private
     */
    case "PUT":
      try {
        const { files }: formidableData = await parseForm(req);
        const parsedFile: formidable.File = files.file as formidable.File;
        const url: string = parsedFile.filepath;
        const buffer: Buffer = fs.readFileSync(url);

        // Delete previous profile picture
        const { profile_picture } = user;
        const deletedFileName = profile_picture?.filename;
        if (deletedFileName) {
          const deleted: boolean = await deleteFileFromS3(deletedFileName);
          if (!deleted)
            return res.status(500).json({
              success: false,
              error: "Server error in deleteing the file",
            });
        }

        // Upload new profile picture
        let signedUrl: string = await uploadFileToS3(
          buffer,
          parsedFile.originalFilename!
        );
        signedUrl = signedUrl.split("?")[0];
        user.profile_picture = {
          filename: parsedFile.originalFilename!,
          signedUrl,
        };

        await user.save();

        res.status(200).json({ success: true, profilePicture: signedUrl });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
