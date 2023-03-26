import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import noteRouter from "./routes/noteRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
connectDB();
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Helo from server");
});

app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
