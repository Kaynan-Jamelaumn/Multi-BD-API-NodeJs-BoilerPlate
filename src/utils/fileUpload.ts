// src/utils/fileUpload.ts
import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Request } from "express";

// Define the upload directory path (default to "public/uploads")
const uploadDir: string = process.env.UPLOAD_DIR || path.resolve("public/uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Generate a secure unique filename
const generateFileName = (originalName: string): string => {
  const fileExt: string = path.extname(originalName).toLowerCase(); // Get file extension
  const uniqueId: string = crypto.randomBytes(8).toString("hex"); // Random unique ID
  return `${Date.now()}-${uniqueId}${fileExt}`; // Secure filename format
};

// Define the Multer storage configuration
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir); // Save files to the uploads directory
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, generateFileName(file.originalname)); // Secure and unique filename
  },
});

// Define allowed MIME types for images
const allowedMimeTypes: string[] = ["image/jpeg", "image/png", "image/gif"];

// File filter to allow only images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // No error, file type is allowed
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed.")); // Error, file type is not allowed
  }
};

// Define Multer configuration options
interface MulterConfig {
  storage: StorageEngine;
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void;
  limits: {
    fileSize: number; // File size limit in bytes
  };
}

const multerConfig: MulterConfig = {
  storage,
  fileFilter,
  limits: {
    fileSize: 12 * 1024 * 1024, // 12MB file size limit
  },
};

// Create and export the Multer middleware instance
const uploadMiddleware = multer(multerConfig);

export default uploadMiddleware;