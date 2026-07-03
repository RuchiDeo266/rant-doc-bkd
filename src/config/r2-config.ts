import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
if (!process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.LAMBDA_TASK_ROOT) {
  dotenv.config();
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_USER_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_USER_SECRET_KEY_ID!,
  },
  maxAttempts: 3,
});
