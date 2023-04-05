import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import FormData from "form-data";
import http from "http";
import { S3 } from "aws-sdk";
// configure the S3 client
// configure the S3 client
const s3Config = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "default key",
    secretAccessKey: process.env.AMAZON_S3_SECRET || "default secret",
  },
});
// configure the multer middleware to handle form-data
const upload = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.AWS_BUCKET_NAME || "default bucket name",
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

interface CustomNextApiRequest {
  body: any;
}

export default async (req: CustomNextApiRequest, res: any) => {
  try {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const form = new FormData();
    form.append("file", req.body.file);

    const { Location } = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME || "default bucket name",
        Body: form,
        ContentType: "image/jpeg",
        Key: `${Date.now()}.jpg`,
      })
      .promise();

    res.status(200).json({ Location });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
