import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Configure CORS with specific options if needed
// TODO: Setup the corsOptions once the frontend is done
// const corsOptions = {
//   origin: "https://example.com", // replace with your allowed origin(s)
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

app.use(express.json());
app.use(cors());

// Routes here

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
