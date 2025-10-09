import express from "express";
import { upload } from "../services/imageService.js";
import {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.post("/create", upload.single("image"), createClient);
router.get("/getall", getAllClients);
router.put("/update/:id", upload.single("image"), updateClient);
router.delete("/delete/:id", deleteClient);

export default router;
