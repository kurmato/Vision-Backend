import Actor from "../models/Actor.js";
import {
  saveImage,
  deleteImage,
  saveMultipleImages,
} from "../services/imageService.js";
import { Op } from "sequelize";
import ActorGallery from "../models/ActorGallery.js";

// Helper function to format actor response with image URL
const formatActorResponse = (actor, baseUrl) => {
  const data = actor.toJSON();
  data.profileImageUrl = data.profileImage
    ? `${baseUrl}api/images/${data.profileImage}`
    : null;
  return data;
};

// CREATE - Create a single actor
export const createActor = async (req, res, next) => {
  try {
    const {
      categoryId,
      name,
      shortDescription,
      tier,
      eventTiming,
      languages,
      city,
      gender,
      genre,
      eventType,
      storyHeading,
      storySubheading,
      storyDescription,
      performanceMembers,
      performanceTiming,
      travelAvailability,
    } = req.body;

    let profileImageId = null;

    if (req.file) {
      const savedImage = await saveImage(req.file);
      profileImageId = savedImage.id;
    }

    const actor = await Actor.create({
      categoryId,
      name,
      shortDescription,
      tier,
      eventTiming,
      languages,
      city,
      gender,
      genre,
      eventType,
      storyHeading,
      storySubheading,
      storyDescription,
      performanceMembers,
      performanceTiming,
      travelAvailability,
      profileImage: profileImageId,
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const actorData = formatActorResponse(actor, baseUrl);

    res.status(201).json({ success: true, data: actorData });
  } catch (error) {
    next(error);
  }
};

// READ - Get all actors with pagination, filtering, and sorting
export const getAllActors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
      city,
      gender,
      tier,
      genre,
      eventType,
      categoryId,
      search,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Apply filters
    if (city) where.city = city;
    if (gender) where.gender = gender;
    if (tier) where.tier = tier;
    if (genre) where.genre = genre;
    if (eventType) where.eventType = eventType;
    if (categoryId) where.categoryId = categoryId;

    // Search functionality
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { shortDescription: { [Op.like]: `%${search}%` } },
        { storyHeading: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: actors } = await Actor.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order.toUpperCase()]],
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const data = actors.map((actor) => formatActorResponse(actor, baseUrl));

    res.json({
      success: true,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
      data,
    });
  } catch (error) {
    next(error);
  }
};

// READ - Get actor by ID
export const getActorById = async (req, res, next) => {
  try {
    const actor = await Actor.findByPk(req.params.id);

    if (!actor) {
      return res.status(404).json({
        success: false,
        message: "Actor not found",
      });
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const data = formatActorResponse(actor, baseUrl);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// READ - Get actors by category
export const getActorsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: actors } = await Actor.findAndCountAll({
      where: { categoryId },
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const data = actors.map((actor) => formatActorResponse(actor, baseUrl));

    res.json({
      success: true,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
      data,
    });
  } catch (error) {
    next(error);
  }
};

// READ - Get actors by tier
export const getActorsByTier = async (req, res, next) => {
  try {
    const { tier } = req.params;

    const actors = await Actor.findAll({
      where: { tier },
      order: [["name", "ASC"]],
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const data = actors.map((actor) => formatActorResponse(actor, baseUrl));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

// READ - Search actors
export const searchActors = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: actors } = await Actor.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { shortDescription: { [Op.like]: `%${query}%` } },
          { city: { [Op.like]: `%${query}%` } },
          { genre: { [Op.like]: `%${query}%` } },
          { storyHeading: { [Op.like]: `%${query}%` } },
        ],
      },
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const data = actors.map((actor) => formatActorResponse(actor, baseUrl));

    res.json({
      success: true,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
      data,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE - Partial update (PATCH)
export const patchActor = async (req, res, next) => {
  try {
    const actor = await Actor.findByPk(req.params.id);

    if (!actor) {
      return res.status(404).json({
        success: false,
        message: "Actor not found",
      });
    }

    // Only update provided fields
    const updatedFields = {};
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        updatedFields[key] = req.body[key];
      }
    });

    await actor.update(updatedFields);

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const data = formatActorResponse(actor, baseUrl);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// UPDATE - Update actor profile image only
export const updateActorImage = async (req, res, next) => {
  try {
    const actor = await Actor.findByPk(req.params.id);

    if (!actor) {
      return res.status(404).json({
        success: false,
        message: "Actor not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    if (actor.profileImage) await deleteImage(actor.profileImage);

    const savedImage = await saveImage(req.file);
    await actor.update({ profileImage: savedImage.id });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const data = formatActorResponse(actor, baseUrl);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete actor by ID
export const deleteActor = async (req, res, next) => {
  try {
    const actor = await Actor.findByPk(req.params.id);

    if (!actor) {
      return res.status(404).json({
        success: false,
        message: "Actor not found",
      });
    }

    if (actor.profileImage) await deleteImage(actor.profileImage);

    await actor.destroy();

    res.json({
      success: true,
      message: "Actor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const uploadActorGallery = async (req, res, next) => {
  try {
    const { actorId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images provided" });
    }

    // Save all images
    const savedImages = await saveMultipleImages(req.files);

    // Create gallery entries
    const galleryEntries = await Promise.all(
      savedImages.map((img) =>
        ActorGallery.create({
          actorId,
          imageId: img.id,
        })
      )
    );

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const data = galleryEntries.map((entry) => ({
      id: entry.id,
      actorId: entry.actorId,
      imageUrl: `${baseUrl}api/images/${entry.imageId}`,
    }));

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Get all images for an actor
export const getActorGallery = async (req, res, next) => {
  try {
    const { actorId } = req.params;
    const gallery = await ActorGallery.findAll({ where: { actorId } });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
    const data = gallery.map((entry) => ({
      id: entry.id,
      actorId: entry.actorId,
      imageUrl: `${baseUrl}api/images/${entry.imageId}`,
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Delete a gallery image
export const deleteGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entry = await ActorGallery.findByPk(id);
    if (!entry) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    // Delete the image from Images table
    await deleteImage(entry.imageId);

    // Delete the gallery entry
    await entry.destroy();

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    next(error);
  }
};
