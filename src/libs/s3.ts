import { env } from "@/env";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export async function getUploadUrl(imageKey: string) {
  const putCommand = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: imageKey,
  });
  return await getSignedUrl(s3Client, putCommand, { expiresIn: 60 });
}

export async function deleteFile(fileKey: string) {
  const deleteParams = {
    Bucket: env.R2_BUCKET_NAME,
    Key: fileKey,
  };

  return await s3Client.send(new DeleteObjectCommand(deleteParams));
}
