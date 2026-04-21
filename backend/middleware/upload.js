import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage to save files in appropriate subdirectories
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = path.join(__dirname, "../uploads");
    let uploadDir = baseDir;
    
    // Determine subdirectory based on file type
    if (file.fieldname === "profileImage") {
      uploadDir = path.join(baseDir, "profiles");
    } else if (file.fieldname === "personImages") {
      uploadDir = path.join(baseDir, "posts/persons");
    } else if (file.fieldname === "itemImages") {
      uploadDir = path.join(baseDir, "posts/items");
    }
    
    // Create directory if it doesn't exist
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) return cb(err, uploadDir);
      cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Set appropriate prefix based on file type
    let prefix = "file";
    if (file.fieldname === "profileImage") {
      prefix = "profile";
    } else if (file.fieldname === "personImages") {
      prefix = "person";
    } else if (file.fieldname === "itemImages") {
      prefix = "item";
    }
    
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Multer upload instance
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});
