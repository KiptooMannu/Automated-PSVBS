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
    })
    .returning({ id: userTable.user_id })
    .execute();

  const userId = newUser[0].id;

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
    await db.delete(userTable).where(eq(userTable.user_id, userId)).execute();
    throw new Error("Registration failed. Please try again.");
  }
};

export const loginUser = async (email: string, password: string) => {
    // Validate email and password
    loginSchema.parse({ email, password });
  
    // Step 1: Find user by email
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .execute();
  
    if (users.length === 0) {
      throw new Error("User not found! Try Again");
    }
  
    const user = users[0];
  
    // Step 2: Find authentication record for the user
    const auths = await db
      .select()
      .from(authTable)
      .where(eq(authTable.user_id, user.user_id))
      .execute();
  
    if (auths.length === 0) {
      throw new Error("Invalid credentials! Try again");
    }
  
    const auth = auths[0];
  
    // Step 3: Compare password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, auth.password_hash);
  
    if (!isPasswordValid) {
      throw new Error("Invalid credentials! Try again");
    }
  
    // Step 4: Generate a JWT token
    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: auth.role },
      secret,
      { expiresIn }
    );
  
    // Step 5: Return token and user data
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
