import FormData from "form-data";
import { S3 } from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

interface S3UploadResponse {
  url: any;
  status?: number;
}

export const uploadHandler = async (
  file: any): Promise<S3UploadResponse> => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const form = new FormData();
  console.log("We have created the form object");
  form.append("file", file);
  console.log("The file has been appended to the form object");
  try{
    const { Key } = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME || "default bucket name",
        Body: form,
        ContentType: "image/jpeg",
        Key: `${Date.now()}.jpg`,
      })
      .promise();
      console.log("The file has been uploaded to Amazon");
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME || "default",
        Key: Key,
        Expires: 3600
      }
      const thisUrl = s3.getSignedUrl("getObject", params);
      return { url: thisUrl };
  }
  catch(err){
    return { url: null, status: 400}
  }
};
