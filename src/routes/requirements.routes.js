import express from "express";
import {
  createRequirement,
  getAllRequirements,
  updateRequirement,
  deleteRequirement,
  verifyEmail,
} from "../controllers/requirementController.js";

const router = express.Router();

router.post("/create", createRequirement);
router.get("/getAll", getAllRequirements);
router.put("/update/:id", updateRequirement);
router.patch("/verify-email/:id", verifyEmail);
router.delete("/delete/:id", deleteRequirement);

export default router;
