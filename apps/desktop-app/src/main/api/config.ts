import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const BACKEND_URL = process.env.BACKEND_URL;
