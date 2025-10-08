import express from "express";
import {
  addReview,
  getActorReviews,
  getAllReviews,
  updateReview,
  deleteReview,
} from "../controllers/actorReviewController.js";

const router = express.Router();

// Add a review
router.post("/create", addReview);
router.get("/get/:actorId", getActorReviews);
router.get("/getall", getAllReviews);
router.put("/update/:id", updateReview);
router.delete("/delete/:id", deleteReview);

export default router;
