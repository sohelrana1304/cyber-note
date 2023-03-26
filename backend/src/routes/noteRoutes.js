import express from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/noteController.js";
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", userAuth, getNotes);

router.post("/createNote", userAuth, createNote);

router.get("/:id", /* userAuth, */ getNoteById);

router.put("/updateNote/:id", userAuth, updateNote);

router.delete("/deleteNote/:id", userAuth, deleteNote);

export default router;
