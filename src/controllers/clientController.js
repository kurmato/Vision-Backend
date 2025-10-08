import Client from "../models/Client.js";
import path from "path";
import fs from "fs";

// ✅ Add new client
export const addClient = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? `/uploads/clients/${req.file.filename}` : null;

    if (!name || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Name and image are required" });
    }

    const client = await Client.create({ name, image });
    res
      .status(201)
      .json({
        success: true,
        message: "Client added successfully",
        data: client,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Update client
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const client = await Client.findByPk(id);

    if (!client)
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });

    if (req.file) {
      // delete old image
      if (client.image) {
        const oldPath = path.join("src", client.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      client.image = `/uploads/clients/${req.file.filename}`;
    }

    if (name) client.name = name;
    await client.save();

    res
      .status(200)
      .json({ success: true, message: "Client updated", data: client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete client
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client)
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });

    // delete image file
    if (client.image) {
      const oldPath = path.join("src", client.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await client.destroy();
    res
      .status(200)
      .json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
