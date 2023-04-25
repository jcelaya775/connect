import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { uploadFileToS3 } from "@/lib/amazon-s3";

// IMPORTANT: Prevents next from trying to parse the form
export const config = {
  api: {
    bodyParser: false,
  },
};

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
        
      } catch (err) {
        console.log(`Something went wrong: ${err}`);
        res.status(401).json({ body: `${err}` });
      }
    }
  }
}
