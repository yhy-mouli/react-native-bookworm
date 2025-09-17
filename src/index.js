import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./lib/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import cors from "cors";
import job from "./lib/cron.js";

const app = express();
const PORT = process.env.PORT || 3000;

job.start();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(3000, () => {
    console.log(`server are running on PORT : ${PORT}`);
    connectDB();
});
