import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/mainRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { corsOptions } from "./config/corsOptions";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes here
app.use("/api", routes, errorHandler);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
