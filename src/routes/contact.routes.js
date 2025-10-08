import express from "express";
import {
  createContact,
  getAllContacts,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/create", createContact);
router.get("/getAll", getAllContacts);
router.delete("/delete/:id", deleteContact);

export default router;
