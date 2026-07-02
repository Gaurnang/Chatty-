import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

import {
  findUserByEmail,
  findUserByUsername,
  createUser,
  findUserById,
} from "../repositories/auth.repository.js";

const SALT_ROUNDS = 10;



export const registerUser = async ({
  username,
  email,
  password,
}) => {
  if (!username || !email || !password) {
    throw new Error("All fields are required.");
  }

  const existingEmail = await findUserByEmail(email);

  if (existingEmail) {
    throw new Error("Email already exists.");
  }

  const existingUsername = await findUserByUsername(username);

  if (existingUsername) {
    throw new Error("Username already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await createUser({
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user.id);

  return {
    user,
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user.id);

  delete user.password;

  return {
    user,
    token,
  };
};

export const getUserById = async (id) => {
  const user = await findUserById(id);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};