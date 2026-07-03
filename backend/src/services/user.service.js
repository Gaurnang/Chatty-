import {
  findUserById,
  findUserByEmail,
  updateUserProfile,
} from "../repositories/user.repository.js";

/**
 * Search user by email
 */
export const searchUserByEmailService = async (
  currentUserId,
  email
) => {
  if (!email?.trim()) {
    throw new Error("Email is required.");
  }

  const user = await findUserByEmail(currentUserId, email.trim());

  if (!user) {
    throw new Error("User not found.");
  }

  // Prevent searching yourself
  if (user.id === currentUserId) {
    throw new Error("You cannot search yourself.");
  }

  return user;
};

/**
 * Get user by id
 */
export const getUserByIdService = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

/**
 * Update profile
 */
export const updateProfileService = async (
  userId,
  profileData
) => {
  const { displayName, bio } = profileData;

  if (!displayName?.trim()) {
    throw new Error("Display name is required.");
  }

  const updatedUser = await updateUserProfile(userId, {
    displayName: displayName.trim(),
    bio: bio?.trim() || null,
  });

  return updatedUser;
};