import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Set upload directory (default to "public/uploads")
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

// Multer configuration
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname)); // Secure and unique filename
  },
});

// File filter to allow only images
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes: string[] = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // No error, file type is allowed
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed.")); // Error, file type is not allowed
  }
};

// Multer instance with limits
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 12 * 1024 * 1024, // 12MB file size limit
  },
});

export default uploadMiddleware;