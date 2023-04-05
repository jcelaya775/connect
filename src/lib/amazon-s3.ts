import axios from "axios";
import FormData from "form-data";
import { S3 } from "aws-sdk";

interface CustomNextApiRequest {
  body: any;
}

interface S3UploadResponse {
  key: string;
  location: string;
}

export const uploadHandler = async (
  req: CustomNextApiRequest
): Promise<S3UploadResponse> => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const form = new FormData();
  form.append("file", req.body.file);

  const { Location, Key } = await s3
    .upload({
      Bucket: process.env.AWS_BUCKET_NAME || "default bucket name",
      Body: form,
      ContentType: "image/jpeg",
      Key: `${Date.now()}.jpg`,
    })
    .promise();

  return { key: Key, location: Location };
};
