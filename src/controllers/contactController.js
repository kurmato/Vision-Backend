import Contact from "../models/Contact.js";

// Create a new contact
export const createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    const contact = await Contact.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { id: contact.id },
    });
  } catch (error) {
    next(error);
  }
};

// Get all contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.findAll({ order: [["createdAt", "DESC"]] });

    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// Delete contact
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, error: "Contact not found" });
    }

    await contact.destroy();
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};
