import { Hono } from "hono";
import { register,login,getUserById,getUsers,updateUser,deleteUser,forgotPassword,resetPassword } from "./auth.controller";

export const userAuthRouter = new Hono();

userAuthRouter.post('/register',register);
userAuthRouter.post('/login',login);
userAuthRouter.get('/users',getUsers)
userAuthRouter.get('/users/:id',getUserById);
userAuthRouter.put('/users/:id',updateUser);
userAuthRouter.delete('/users/:id',deleteUser);
// forgot password
userAuthRouter.post('/forgot-password',forgotPassword);
// reset password
userAuthRouter.post('/reset-password' ,resetPassword);
