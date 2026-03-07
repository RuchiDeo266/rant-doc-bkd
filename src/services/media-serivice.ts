import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { r2Client } from "../config/r2-config.ts";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export class MediaService {
  private bucket: string;

  constructor(bucket: string = process.env.R2_BUCKET!) {
    this.bucket = bucket;
  }

  async uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    mimetype: string,
  ): Promise<string> {
    const key = `articles/images/${Date.now()}-${originalName}`;
    try {
      const compressed = await sharp(fileBuffer)
        .avif({ quality: 80, effort: 4 }) // High quality, small size
        .toBuffer();

      await r2Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: compressed,
          ContentType: mimetype,
        }),
      );

      return `${process.env.R2_PUBLIC_DOMAIN}/${key}`;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload image");
    }
  }

  async uploadAudio(
    fileBuffer: Buffer,
    originalName: string,
    mimetype: string,
  ): Promise<string> {
    const key = `articles/audio/${Date.now()}-${originalName}`;
    try {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: mimetype,
        }),
      );
      return `${process.env.R2_PUBLIC_DOMAIN}/${key}`;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to fetch video");
    }
  }

  async deleteFromR2(key: string[]): Promise<void> {
    try {
      const command = new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Delete: {
          Objects: key.map((Key) => ({ Key })),
          Quiet: true, // less verbose response
        },
      });

      await r2Client.send(command);
      console.log(`Deleted: ${key}`);
    } catch (err: any) {
      if (err.name === "NoSuchKey") {
        console.log(`File not found, already deleted: ${key}`);
        return;
      }
      throw err;
    }
  }
}
