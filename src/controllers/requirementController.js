import EmailVerification from "../models/EmailVerification.js";
import Requirement from "../models/Requirement.js";

export const createRequirement = async (req, res) => {
  try {
    const {
      eventId,
      categoryId,
      occasions,
      eventDate,
      city,
      budget,
      fullName,
      email,
      mobileNumber,
      additionalInfo,
    } = req.body;

    if (
      !occasions ||
      !eventDate ||
      !city ||
      !fullName ||
      !email ||
      !mobileNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Check email verification
    const verified = await EmailVerification.findOne({
      where: { email, verified: true },
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before submitting",
      });
    }

    // ✅ Proceed to create requirement
    const requirement = await Requirement.create({
      eventId,
      categoryId,
      occasions,
      eventDate,
      city,
      budget,
      fullName,
      email,
      mobileNumber,
      additionalInfo,
      isEmailVerified: true, 
    });

    res.status(201).json({
      success: true,
      message: "Requirement created successfully",
      data: requirement,
    });
  } catch (error) {
    console.error("Error creating requirement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create requirement",
      error: error.message,
    });
  }
};

// Get all requirements with optional filters
export const getAllRequirements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      email,
      eventId,
      categoryId,
      startDate,
      endDate,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (email) where.email = email;
    if (eventId) where.eventId = eventId;
    if (categoryId) where.categoryId = categoryId;

    if (startDate && endDate) {
      where.eventDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      where.eventDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      where.eventDate = { [Op.lte]: new Date(endDate) };
    }

    const { count, rows } = await Requirement.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Requirements retrieved successfully",
      data: {
        requirements: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching requirements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requirements",
      error: error.message,
    });
  }
};

// Get a single requirement by ID
export const getRequirementById = async (req, res) => {
  try {
    const { id } = req.params;

    const requirement = await Requirement.findByPk(id);

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Requirement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Requirement retrieved successfully",
      data: requirement,
    });
  } catch (error) {
    console.error("Error fetching requirement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requirement",
      error: error.message,
    });
  }
};

// Update a requirement
export const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const requirement = await Requirement.findByPk(id);

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Requirement not found",
      });
    }

    // Update the requirement
    await requirement.update(updateData);

    res.status(200).json({
      success: true,
      message: "Requirement updated successfully",
      data: requirement,
    });
  } catch (error) {
    console.error("Error updating requirement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update requirement",
      error: error.message,
    });
  }
};

// Delete a requirement
export const deleteRequirement = async (req, res) => {
  try {
    const { id } = req.params;

    const requirement = await Requirement.findByPk(id);

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Requirement not found",
      });
    }

    await requirement.destroy();

    res.status(200).json({
      success: true,
      message: "Requirement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting requirement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete requirement",
      error: error.message,
    });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const requirement = await Requirement.findByPk(id);

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Requirement not found",
      });
    }

    requirement.isEmailVerified = true;
    await requirement.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: requirement,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
      error: error.message,
    });
  }
};

// Get requirements by email
export const getRequirementsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const requirements = await Requirement.findAll({
      where: { email },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Requirements retrieved successfully",
      data: requirements,
    });
  } catch (error) {
    console.error("Error fetching requirements by email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requirements",
      error: error.message,
    });
  }
};
