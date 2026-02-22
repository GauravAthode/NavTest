import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./src/config/db.js";
import tripRoutes from "./src/routes/tripRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: false
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/trips", tripRoutes);

const port = Number(process.env.PORT || 4500);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Backend running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });