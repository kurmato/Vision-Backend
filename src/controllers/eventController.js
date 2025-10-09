import Event from "../models/Event.js";
import { saveImage, deleteImage } from "../services/imageService.js";

// Create Event
export const createEvent = async (req, res, next) => {
  try {
    const { categoryId, name } = req.body;
    let imageId = null;

    if (req.file) {
      const savedImage = await saveImage(req.file);
      imageId = savedImage.id;
    }

    const event = await Event.create({ categoryId, name, image: imageId });

    const baseUrl = process.env.BASE_URL;
    const eventData = event.toJSON();
    eventData.imageUrl = imageId ? `${baseUrl}api/images/${imageId}` : null;

    res.status(201).json({ success: true, data: eventData });
  } catch (error) {
    next(error);
  }
};

// Get all Events
export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({ order: [["id", "ASC"]] });
    const baseUrl = process.env.BASE_URL;

    const result = events.map((evt) => ({
      id: evt.id,
      categoryId: evt.categoryId,
      name: evt.name,
      imageUrl: evt.image ? `${baseUrl}api/images/${evt.image}` : null,
      createdAt: evt.createdAt,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// Get Event by ID
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    const baseUrl = process.env.BASE_URL;
    const eventData = event.toJSON();
    eventData.imageUrl = event.image
      ? `${baseUrl}api/images/${event.image}`
      : null;

    res.json({ success: true, data: eventData });
  } catch (error) {
    next(error);
  }
};

// Update Event
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryId, name } = req.body;

    const event = await Event.findByPk(id);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    let imageId = event.image;

    if (req.file) {
      if (imageId) await deleteImage(imageId); // delete old image
      const savedImage = await saveImage(req.file);
      imageId = savedImage.id;
    }

    await event.update({ categoryId, name, image: imageId });

    const baseUrl = process.env.BASE_URL;
    const eventData = event.toJSON();
    eventData.imageUrl = imageId ? `${baseUrl}api/images/${imageId}` : null;

    res.json({ success: true, data: eventData });
  } catch (error) {
    next(error);
  }
};

// Delete Event
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    if (event.image) {
      await deleteImage(event.image);
    }

    await event.destroy();
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};
