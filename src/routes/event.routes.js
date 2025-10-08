import express from "express";
import { upload } from "../services/imageService.js";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/create", upload.single("image"), createEvent);
router.get("/getAll", getAllEvents);
router.get("/getById/:id", getEventById);
router.put("/update/:id", upload.single("image"), updateEvent);
router.delete("/delete/:id", deleteEvent);

export default router;
