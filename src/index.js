import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./lib/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

const PORT = process.env.PORT;

app.listen(3000, () => {
    console.log(`server are running on PORT : ${PORT}`);
    connectDB();
});
