import { Context } from "hono";
import { 
    registerUser,
    loginUser,
    getUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    getUserByEmailService 
} from "./auth.service";
import bcrypt from 'bcrypt';
import { sendEmail } from "../utils/mail";
import { verifyUser } from "./auth.service";

export const register = async (c: Context) => {
    try {
        const user = await c.req.json();
        const message = await registerUser(user);
        return c.json({ message }, 201);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};

export const login = async (c: Context) => {
    try {
        const body = await c.req.json();
        console.log("Received login request:", body);

        if (!body.email || !body.password) {
            console.error("Missing email or password");
            return c.json({ message: "Email and password are required" }, 400);
        }

        const { token, user } = await loginUser(body.email, body.password);

        console.log("Login successful:", user);
        return c.json({ token, user }, 200);
    } catch (error: any) {
        console.error("Login error:", error.message);
        return c.json({ error: error.message }, 400);
    }
};


export const getUsers = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit')) || 10;  
        const data = await getUsersService(limit);

        if (!data || data.length === 0) {
            return c.json({ message: 'No users found' }, 404);
        }
        
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};

export const getUserById = async (c: Context) => {
    try {
        const id = parseInt(c.req.param('id'), 10); 
        
        if (isNaN(id)) { // Ensure that ID is a valid number
            return c.json({ error: 'Invalid ID' }, 400);
        }

        const user = await getUserByIdService(id);

        if (!user) {
            return c.json({ message: 'User not found' }, 404);
        }

        return c.json(user, 200);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};

export const updateUser = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    
    if (isNaN(id)) { // Ensure that ID is a valid number
        return c.json({ error: 'Invalid ID' }, 400);
    }
    
    const user = await c.req.json();
    
    try {
        const existingUser = await getUserByIdService(id);
        
        if (!existingUser) {
            return c.json({ message: 'User not found' }, 404);
        }

        const updateResult = await updateUserService(id, user);
        
        if (!updateResult) {
            return c.json({ message: 'User not updated' }, 400);
        }

        return c.json({ message: 'User updated successfully' }, 200);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};

export const deleteUser = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);

    if (isNaN(id)) { // Ensure that ID is a valid number
        return c.json({ error: 'Invalid ID' }, 400);
    }

    try {
        const existingUser = await getUserByIdService(id);
        
        if (!existingUser) {
            return c.json({ message: 'User not found' }, 404);
        }

        const deleteResult = await deleteUserService(id);
        
        if (!deleteResult) {
            return c.json({ message: 'User not deleted' }, 400);
        }

        return c.json({ message: 'User deleted successfully' }, 200);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};

export const forgotPassword = async (c: Context) => {
    try {
        const { email } = await c.req.json();
        const user = await getUserByEmailService(email);

        if (!user) {
            return c.json({ message: 'User not found' }, 404);
        }

        const randomPassword = Math.random().toString(36).slice(-8);
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(randomPassword, salt);

        await updateUserService(user.user_id, { password: hashedPassword });

        const response = await sendEmail(
            email, 
            'Password Reset', 
            `Your new password is ${randomPassword}. Please keep it safe and use it to login.`
        );

        return c.json({ message: 'Password reset successful', response }, 200);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};
export const sendVerificationEmail = async (email: string, verificationUrl: string,token: string) => { 
    const user = await getUserByEmailService(email);
  
    if (!user) {
      throw new Error('User not found');
    }
  
    const response = await sendEmail(
        email,
        '🔐 Email Verification Required',
        `
          <p>👋 Hello there!</p>
          <img src="https://cdn.pixabay.com/photo/2017/02/03/09/39/hand-2034842_1280.jpg" alt="Welcome Image" width="200" style="border-radius: 10px; margin-bottom: 10px;"/>
          <p>We’re excited to have you on board. To get started, please verify your email address by clicking the link below:</p>
          <p>👉 <a href="${verificationUrl}" style="color: #4CAF50; font-weight: bold;">Verify Your Account</a></p>
          <p>✅ This step helps us ensure your account is secure and ready to use.</p>
          <p>If you didn’t sign up, you can safely ignore this email. 😊</p>
          <p>⚠️ Please note: This verification link will expire in <strong>2 hours</strong>. Make sure to verify your account before it expires!</p>
          <p>Thanks,</p>
          <p>🚀 The Seat Reservation Team</p>
        `
      );
      
  
    return response;
  };
  
export const verifyAccount = async (c: Context) => {
    try {
      const { token } = c.req.param(); 
      const message = await verifyUser(token);
      return c.json({ message });
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  };
  

export const resetPassword = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();
        const user = await getUserByEmailService(email);

        if (!user) {
            return c.json({ message: 'User not found' }, 404);
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        await updateUserService(user.user_id, { password: hashedPassword });

        return c.json({ message: 'Password reset successful' }, 200);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
};
