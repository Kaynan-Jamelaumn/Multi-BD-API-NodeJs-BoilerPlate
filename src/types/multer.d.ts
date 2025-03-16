// src/types/multer.d.ts
import { Request } from "express";

// Define the File type for Multer
export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Extend the Express Request type to include the `file` property
declare module "express-serve-static-core" {
  interface Request {
    file?: File;
    files?: File[];
  }
}