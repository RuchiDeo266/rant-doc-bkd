import { S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_USER_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_USER_SECERT_KEY_ID!,
  },
  maxAttempts: 3,
});
