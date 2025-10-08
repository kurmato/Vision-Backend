import express from "express";
import {
  createActor,
  getAllActors,
  getActorById,
  getActorsByCategory,
  getActorsByTier,
  searchActors,
  patchActor,
  updateActorImage,
  deleteActor,
  uploadActorGallery,
  getActorGallery,
  deleteGalleryImage,
} from "../controllers/actorController.js";
import { upload } from "../services/imageService.js";

const router = express.Router();

// CREATE
router.post("/create", upload.single("profileImage"), createActor);

// READ
router.get("/getAll", getAllActors);
router.get("/search", searchActors);
router.get("/category/:categoryId", getActorsByCategory);
router.get("/tier/:tier", getActorsByTier);
router.get("/getById/:id", getActorById);

// UPDATE
router.patch("/update/:id", patchActor);
router.put(
  "/update/image/:id",
  upload.single("profileImage"),
  updateActorImage
);

// DELETE
router.delete("/delete/:id", deleteActor);

// Gallary
router.post("/uploadGallery", upload.array("images", 10), uploadActorGallery);
router.get("/getAll/:actorId", getActorGallery);
router.delete("/:id", deleteGalleryImage);

export default router;
