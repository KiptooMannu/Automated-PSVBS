import { Hono } from "hono";
import { register,login,getUserById,getUsers,updateUser,deleteUser } from "./auth.controller";

export const userAuthRouter = new Hono();

userAuthRouter.post('/register',register);
userAuthRouter.post('/login',login);
userAuthRouter.get('/users',getUsers)
userAuthRouter.get('/users/:id',getUserById);
userAuthRouter.put('/users/:id',updateUser);
userAuthRouter.delete('/users/:id',deleteUser);