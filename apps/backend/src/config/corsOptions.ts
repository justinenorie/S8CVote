import { CorsOptions } from "cors";

const devOrigins = [
  "http://localhost:3000", // Web app dev
  "http://localhost:5173", // Electron renderer dev
  "http://localhost:19006", // Mobile Expo dev
];

const prodOrigins = [
  "https://vote.example.com", // Web app prod
  "app://.", // Electron packaged app
  // Mobile RN doesn’t need CORS
];

const allowedOrigins =
  process.env.NODE_ENV === "development" ? devOrigins : prodOrigins;

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
