import type { NextApiRequest, NextApiResponse } from "next";
import multerS3 from 'multer-s3';
import multer from "multer";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { getAuthUser } from "@/lib/auth";
import { S3Client } from '@aws-sdk/client-s3';
import AWS from "aws-sdk";

//s3 instance for getSignedUrl()
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
//s3 client to upload using multers3
const s3Client = new S3Client({
  region: "your-region",
  credentials: {
    accessKeyId: "your-access-key-id",
    secretAccessKey: "your-secret-access-key",
  },
});

//function to parse form data
async function parseFormData(
  req: NextApiRequest & { files?: any },
  res: NextApiResponse
) {

	//create the storage instance
  const storage = multer.memoryStorage();

	//attempt to create the upload instance
  const multerUpload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: "connectImagesAndVideos",
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
  });
	//create the file instance from the upload object
  const multerFiles = multerUpload.any();

	//create a promise to upload the file to the s3 bucket
  await new Promise((resolve, reject) => {
    multerFiles(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  // Get the URL of the uploaded file
  const url = s3.getSignedUrl("getObject", {
    Bucket: "connectImagesAndVideos",
    Key: req.files[0].key,
  });

  // Return the URL
  return {
    url: url,
  };
}

// IMPORTANT: Prevents next from trying to parse the form
export const config = {
  api: {
    bodyParser: false,
  },
};

interface ReturnData {
  success: boolean;
  httpResponse: string;
  data?: string;
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
    case "POST":
    {
        const url = parseFormData(req, res);
				if(!url){
					res.status(400).json({ success: false, httpStatus: "Bad Request" });
				}
				res.status(201).json({ success: true, httpStatus: "Accepted", data: url})
  	}
	}
}
