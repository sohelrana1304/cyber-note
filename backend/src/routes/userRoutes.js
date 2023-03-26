import express from "express";
import {
  updateUserProfile,
  userLogin,
  userSignUp,
} from "../controllers/userController.js";
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test2", (req, res) => {
  res.send("Helo from Route");
});


router.post("/register", userSignUp);
router.post("/login", userLogin);
router.put("/profile", userAuth, updateUserProfile);

export default router;
