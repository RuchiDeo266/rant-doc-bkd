export const normalizeRequestBody = (body: any, contentType?: string) => {
  if (contentType?.includes("multipart/form-data")) {
    return body; // let multer handle this untouched
  }

  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString("utf-8"));
    } catch {
      return body;
    }
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }

  return body;
};
