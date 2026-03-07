export interface IHashService {
  hash(input: string): string;
}

import crypto from "crypto";

export class HashService implements IHashService {
  private salt: string;

  constructor(salt: string) {
    this.salt = salt;
  }

  hash(input: string): string {
    return crypto
      .createHash("sha256")
      .update(input + this.salt)
      .digest("hex");
  }
}
