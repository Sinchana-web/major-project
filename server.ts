import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { analyzeLivestockImage, searchBreedWithGemini } from "./src/server/breedService";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const corsOptions: cors.CorsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Set up secure Multer for handling file uploads in memory with strict validation
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase()) || /\.(jpe?g|png|webp|mp4|mov|webm|avi)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported media format. Please upload JPG, PNG, WEBP, MP4, MOV, or WEBM."));
    }
  },
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "running",
    engine: "Google Gemini 2.5 Flash Vision + ICAR-NBAGR Grounded",
    gemini_vision_enabled: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Root status endpoint
app.get("/api/status", (_req, res) => {
  res.json({
    status: "running",
    message: "Pashu Pehchaan - AI Livestock Recognition & National Breed Intelligence API",
    gemini_vision_enabled: Boolean(process.env.GEMINI_API_KEY),
    media_supported: ["Photos (JPG/PNG)", "Videos (MP4/MOV/WEBM/AVI)"],
  });
});

// Prediction endpoint - supports both /predict and /api/predict for full backward compatibility
const handlePredict = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: "No media file provided. Use form-data key 'image'.",
        message: "No media file provided. Use form-data key 'image'.",
      });
      return;
    }

    const mime = req.file.mimetype || "image/jpeg";
    const isVideo = mime.startsWith("video/") || /\.(mp4|mov|webm|avi)$/i.test(req.file.originalname);
    const mediaType: "image" | "video" = isVideo ? "video" : "image";

    const result = await analyzeLivestockImage(req.file.buffer, mime, mediaType);
    res.json(result);
  } catch (error: any) {
    console.error("Prediction error:", error);
    const msg = error.message || "Failed to identify animal breed.";
    res.status(400).json({
      success: false,
      error: msg,
      message: msg,
    });
  }
};

app.post("/predict", upload.single("image") as any, handlePredict as any);
app.post("/api/predict", upload.single("image") as any, handlePredict as any);

// Search breed endpoint - supports both /api/search-breed and /search-breed
const handleSearchBreed: express.RequestHandler = async (req, res) => {
  const query = (req.body?.query || req.query?.query || "").toString().trim();
  if (!query) {
    res.status(400).json({ error: "Query parameter 'query' is required." });
    return;
  }

  try {
    const breed = await searchBreedWithGemini(query);
    res.json({ success: true, breed });
  } catch (error: any) {
    console.error("Breed search error:", error);
    res.status(500).json({ success: false, error: error.message || "Breed search failed" });
  }
};

app.get("/api/search-breed", handleSearchBreed);
app.post("/api/search-breed", handleSearchBreed);

// Multer and general error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ success: false, error: "File exceeds 50 MB limit. Please upload a smaller file." });
      return;
    }
    res.status(400).json({ success: false, error: err.message });
    return;
  }
  if (err) {
    res.status(400).json({ success: false, error: err.message || "An error occurred during file upload." });
    return;
  }
  next();
});

// Setup Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`Pashu Pehchaan server running on http://${HOST}:${PORT}`);
  });
}

startServer();
