import {
  searchUserByEmailService,
  getUserByIdService,
  updateProfileService,
} from "../services/user.service.js";

/**
 * @desc Search user by email
 * @route GET /api/users/search
 */
export const searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await searchUserByEmailService(
      req.user.id,
      email
    );

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get user by id
 * @route GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserByIdService(id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update logged-in user's profile
 * @route PATCH /api/users/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateProfileService(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};