import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage with dynamic subfolders
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseUploads = path.join(__dirname, "../../uploads");
    // Determine logical group
    const type = (req.body?.type || "").toString();
    let group = "misc";
    if (file.fieldname === "profileImage") {
      group = "profiles";
    } else if (file.fieldname === "personImages" || type.startsWith("lost_person") || type.startsWith("found_person")) {
      group = path.join("posts", "persons");
    } else if (file.fieldname === "itemImages" || type.startsWith("lost_item") || type.startsWith("found_item")) {
      group = path.join("posts", "items");
    }

    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const targetDir = path.join(baseUploads, group, year, month);

    fs.mkdir(targetDir, { recursive: true }, (err) => {
      if (err) return cb(err, targetDir);
      cb(null, targetDir);
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
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
