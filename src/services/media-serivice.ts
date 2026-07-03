import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "../config/r2-config";
import Vips from "wasm-vips";

type R2DeleteResult = {
  success: boolean;
  deleted: string[];
  failed: string[];
  message?: string;
};

let vipsPromise: ReturnType<typeof Vips> | null = null;
function getVips() {
  if (!vipsPromise) vipsPromise = Vips();
  return vipsPromise;
}

async function compressToAvif(fileBuffer: Buffer): Promise<Buffer> {
  const vips = await getVips();
  const image = vips.Image.newFromBuffer(fileBuffer);
  const outBuffer = image.writeToBuffer(".avif", { Q: 80, effort: 4 });
  image.delete(); // free native memory
  return Buffer.from(outBuffer);
}

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
      const compressed = await compressToAvif(fileBuffer);

      await r2Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: compressed,
          ContentType: mimetype,
        }),
      );

      return `${process.env.R2_PUBLIC_DOMAIN}/rantdoc/${key}`;
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
    const ogname = originalName.trim();
    const key = `articles/audio/${Date.now()}-${ogname}`;
    try {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: mimetype,
        }),
      );
      return `${process.env.R2_PUBLIC_DOMAIN}/rantdoc/${key}`;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to fetch video");
    }
  }

  private getR2Key(url: string) {
    return decodeURIComponent(new URL(url).pathname.slice(1));
  }

  async deleteFromR2(urls: string[]): Promise<R2DeleteResult> {
    const deleted: string[] = [];
    const failed: string[] = [];

    try {
      const keys = urls.filter(Boolean).map((url) => this.getR2Key(url));

      if (!keys.length) {
        return {
          success: false,
          deleted: [],
          failed: [],
          message: "No valid URLs provided",
        };
      }

      const command = new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET,
        Delete: {
          Objects: keys.map((Key) => ({ Key })),
          Quiet: false,
        },
      });

      const response = await r2Client.send(command);

      // successfully deleted files
      if (response.Deleted) {
        response.Deleted.forEach((obj) => {
          if (obj.Key) deleted.push(obj.Key);
        });
      }

      // failed deletions
      if (response.Errors) {
        response.Errors.forEach((err) => {
          if (err.Key) failed.push(err.Key);
        });
      }

      return {
        success: failed.length === 0,
        deleted,
        failed,
        message:
          failed.length > 0
            ? "Some files failed to delete"
            : "Files deleted successfully",
      };
    } catch (error: any) {
      console.error("R2 deletion error:", error);

      return {
        success: false,
        deleted: [],
        failed: urls,
        message: error.message || "Unexpected R2 deletion error",
      };
    }
  }
}
