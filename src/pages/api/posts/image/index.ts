import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { parseFormFile } from "@/lib/parse-form-file";
import { uploadFileToS3 } from "@/lib/amazon-s3";

// IMPORTANT: Prevents next from trying to parse the form
export const config = {
  api: {
    bodyParser: false,
  },
};

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
        console.log(`pre parse`);
        const file = await parseFormFile(req);
        if (!file) {
          res.status(404).json({ success: false });
          return;
        }
        console.log(`pre upload. file: ${file.buffer}`);
        const url = await uploadFileToS3(file);
        if (url) {
          res.status(200).json({ success: true, url: url });
          return;
        }
        res.status(202).json({ success: true, url: null });
      } catch (err) {
        console.log(`Something went wrong: ${err}`);
        res.status(401).json({ body: "yeahhhh we fucked up" });
      }
    }
  }
}
