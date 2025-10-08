import express from "express";
import { upload } from "../services/imageService.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", upload.single("image"), createCategory);
router.get("/getAll", getAllCategories);
router.get("/getById/:id", getCategoryById);
router.put("/update/:id", upload.single("image"), updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;