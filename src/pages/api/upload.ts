import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { parseForm } from "@/lib/parseForm";
import { getAuthUser } from "@/lib/auth";
import axios, { AxiosResponse } from "axios";
import fs from "fs";
import formidable from "formidable";
import FormData from "form-data";
import { IUser } from "@/models/User";

// IMPORTANT: Prevents next from trying to parse the form
// interface ParsedFile {
//   filename: string | null;
//   content: Buffer;
// }
// interface uploadFile {
//   success: boolean;
//   signedUrl?: string;
//   message: string;
//   key?: string;
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { method }: { method?: string } = req;

  const user: IUser | null | void = await getAuthUser(req, res);
  if (!user || !user.facebook.page_token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  switch (method) {
    case "POST":
      try {
        const {
          fields,
          files,
        }: { fields: formidable.Fields; files: formidable.Files } =
          await parseForm(req);
        const file: formidable.File = files.file as formidable.File;

        const url: string = file.filepath;
        const buffer: Buffer = fs.readFileSync(url);
        const formData: FormData = new FormData();
        formData.append("access_token", user.facebook.page_token);
        formData.append("caption", "Hello World");
        formData.append("source", buffer, {
          filename: url,
          contentType: "image/jpeg",
        });

        const response: AxiosResponse = await axios.post(
          "https://graph.facebook.com/v16.0/me/photos",
          formData,
          { headers: { ...formData.getHeaders() } }
        );
        console.log(response.data);

        res.status(200).json({ success: true, data: url });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
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
