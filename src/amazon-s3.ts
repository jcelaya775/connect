import aws from "aws-sdk";
import { S3 } from "aws-sdk";
import { Readable } from "stream";
import fs from "fs";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadVideoToS3 = (file: any) => {
  const params: S3.Types.PutObjectRequest = {
    Bucket: "connect-social-media-bucket",
    Key: `connectVideos/${file.originalname}`,
    Body: Readable.from(file.buffer),
  };

  return s3.upload(params).promise();
};

export const uploadImageToS3 = (file: any) => {
  const params: S3.Types.PutObjectRequest = {
    Bucket: "connect-social-media-bucket",
    Key: `connectImages/${file.originalname}`,
    Body: fs.createReadStream(file.path),
  };

  return s3.upload(params).promise();
};
