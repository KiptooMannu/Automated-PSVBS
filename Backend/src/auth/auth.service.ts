import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../drizzle/db";
import { userTable, authTable } from "../drizzle/schema";
import { registerSchema, loginSchema } from "../validators/user.validator";
import { eq } from "drizzle-orm";

const secret = process.env.SECRET!;
const expiresIn = process.env.EXPIRESIN!;

export const registerUser = async (user: any) => {
  registerSchema.parse(user);

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, user.email))
    .execute();

  if (existingUser.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = await db
    .insert(userTable)
    .values({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      image_url: user.image_url,
      password: hashedPassword,// Hash the password before storing it
    })
    .returning({ id: userTable.user_id })
    .execute();

  const userId = newUser[0].id;

  if (!user.username) {
    // Clean up and throw an error if username is missing
    await db.delete(userTable).where(eq(userTable.user_id, userId)).execute();
    throw new Error("Username is required for registration");
}

  try {
    await db
      .insert(authTable)
      .values({
        user_id: userId,
        username: user.username,
        password_hash: hashedPassword,
        role: user.role || "user", // Default role should be 'user'
      })
      .execute();

    return "User registered successfully";
  } catch (error) {
    console.log('Registration Error!!:' ,error);
    await db.delete(userTable).where(eq(userTable.user_id, userId)).execute();
    throw new Error("Registration failed. Please try again.");
  }
};

export const loginUser = async (email: string, password: string) => {
  console.log("Searching for user with email:", email);

  // Step 1: Find user by email
  const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .execute();

  console.log("User query result:", users);

  if (users.length === 0) {
      throw new Error("User not found! Try Again");
  }

  const user = users[0];

  // Step 2: Find authentication record for the user
  console.log("Searching for auth record for user ID:", user.user_id);
  const auths = await db
      .select()
      .from(authTable)
      .where(eq(authTable.user_id, user.user_id))
      .execute();

  console.log("Auth query result:", auths);

  if (auths.length === 0) {
      throw new Error("Invalid credentials! Try again");
  }

  const auth = auths[0];

  // Step 3: Compare password with the stored hashed password
  console.log("Comparing provided password with stored hash...");
  const isPasswordValid = await bcrypt.compare(password, auth.password_hash);

  if (!isPasswordValid) {
      console.error("Password mismatch!");
      throw new Error("Invalid credentials! Try again");
  }

  // Step 4: Generate a JWT token
  if (!process.env.SECRET || !process.env.EXPIRESIN) {
      console.error("JWT Secret or Expiration not set");
      throw new Error("Server configuration error");
  }

  console.log("Generating JWT token...");
  const token = jwt.sign(
      { id: user.user_id, email: user.email, role: auth.role },
      process.env.SECRET!,
      { expiresIn: process.env.EXPIRESIN! }
  );

  return { token, user };
};


export const getUsersService = async (limit: number = 10) => {
  const users = await db.select().from(userTable).limit(limit).execute();
  return users;
};

export const getUserByIdService = async (id: number) => { // Ensure id is a number
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.user_id, id))
    .execute();

  if (user.length === 0) {
    return { message: "User not found", data: null };
  }

  return { message: "User found", data: user[0] };
};

export const updateUserService = async (userId: number, updatedData: any) => { // Ensure userId is a number
  const updatedUser = await db
    .update(userTable)
    .set(updatedData)
    .where(eq(userTable.user_id, userId))
    .returning()
    .execute();

  if (updatedUser.length === 0) {
    throw new Error("User update failed or user not found");
  }

  return { message: "User updated successfully", data: updatedUser[0] };
};

export const deleteUserService = async (userId: number) => { // Ensure userId is a number
    const deletedUser = await db
    .delete(userTable) // Provide the table name here
    .where(eq(userTable.user_id, userId))
    .returning()
    .execute();

  if (deletedUser.length === 0) {
    throw new Error("User deletion failed or user not found");
  }

  return { message: "User deleted successfully", data: deletedUser[0] };
};

export const getUserByEmailService = async (email: string) => {
  const users = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .execute();

  if (users.length === 0) {
    throw new Error("User not found");
  }

  return users[0];
};
