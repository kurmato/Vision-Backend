import Client from "../models/Client.js";
import { saveImage, deleteImage } from "../services/imageService.js";

// ✅ Create a new client
export const createClient = async (req, res, next) => {
  try {
    const { name } = req.body;
    let imageId = null;

    if (req.file) {
      const savedImage = await saveImage(req.file);
      imageId = savedImage.id;
    }

    const client = await Client.create({
      name,
      image: imageId,
    });

    const baseUrl = process.env.BASE_URL;
    const clientData = client.toJSON();
    clientData.imageUrl = imageId ? `${baseUrl}api/images/${imageId}` : null;

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: clientData,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all clients
export const getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.findAll({ order: [["name", "ASC"]] });
    const baseUrl = process.env.BASE_URL;

    const result = clients.map((c) => ({
      id: c.id,
      name: c.name,
      imageUrl: c.image ? `${baseUrl}api/images/${c.image}` : null,
      createdAt: c.createdAt,
    }));

    res.json({ success: true, message: "Clients fetched successfully", data: result });
  } catch (error) {
    next(error);
  }
};

// ✅ Get single client by ID
export const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }

    const baseUrl = process.env.BASE_URL;
    const clientData = client.toJSON();
    clientData.imageUrl = client.image ? `${baseUrl}api/images/${client.image}` : null;

    res.json({ success: true, data: clientData });
  } catch (error) {
    next(error);
  }
};

// ✅ Update client
export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const client = await Client.findByPk(id);

    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }

    let imageId = client.image;

    if (req.file) {
      // Delete old image if exists
      if (imageId) await deleteImage(imageId);

      // Save new image
      const savedImage = await saveImage(req.file);
      imageId = savedImage.id;
    }

    await client.update({ name, image: imageId });

    const baseUrl = process.env.BASE_URL;
    const clientData = client.toJSON();
    clientData.imageUrl = imageId ? `${baseUrl}api/images/${imageId}` : null;

    res.json({
      success: true,
      message: "Client updated successfully",
      data: clientData,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete client
export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }

    // Delete associated image if exists
    if (client.image) await deleteImage(client.image);

    await client.destroy();

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
