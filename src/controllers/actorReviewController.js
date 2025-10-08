import ActorReview from "../models/Review.js";

// CREATE - Add a review
export const addReview = async (req, res, next) => {
  try {
    const { actorId, userName, rating, comment } = req.body;

    if (!actorId || !userName || !rating) {
      return res
        .status(400)
        .json({
          success: false,
          message: "actorId, userName, and rating are required",
        });
    }

    const review = await ActorReview.create({
      actorId,
      userName,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// READ - Get all reviews for an actor
export const getActorReviews = async (req, res, next) => {
  try {
    const { actorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: reviews } = await ActorReview.findAndCountAll({
      where: { actorId },
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE - Update a review
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await ActorReview.findByPk(id);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    await review.update({ rating, comment });
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete a review
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await ActorReview.findByPk(id);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    await review.destroy();
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// READ - Get all reviews (paginated)
export const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sortBy = "createdAt", order = "DESC" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: reviews } = await ActorReview.findAndCountAll({
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order.toUpperCase()]],
    });

    res.json({
      success: true,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

