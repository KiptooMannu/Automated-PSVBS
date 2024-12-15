import { Context } from "hono";
import { registerUser,loginUser,getUsersService,getUserByIdService,updateUserService,deleteUserService } from "./auth.service";
import { is } from "drizzle-orm";


export const register = async(c: Context) => {
    try {
        const user = await c.req.json();
        const message = await registerUser(user);
        return c.json({message}, 201);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
    }
}

export const login = async(c: Context) => {
    try {
        const {email, password} = await c.req.json();
        const {token,user} = await loginUser(email, password);
        return c.json({token,user}, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
        
    }
}

//get all users
export const getUsers = async(c: Context) => {
    try {
        const limit = Number(c.req.query('limit'));

        const data = await getUsersService(limit);
        if(data == null || data.length === 0){
            return c.json({message: 'No users found'}, 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
        
    }
}

//get a single user
export const getUserById = async(c: Context) =>{
    try {
        const id = parseInt(c.req.param('id'));
        if(isNaN(id)){
            return c.json({error: 'Invalid id'}, 400);
        }
        const user = await getUserByIdService(id);
        if(user === undefined){
            return c.json({message: 'User not found'}, 404);
        }
        return c.json(user, 200);

    } catch (error: any) {
        return c.json({error: error.message}, 400)
        
    }
}

//update a user
export const updateUser = async(c: Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)){
        return c.json({error: 'Invalid id'}, 400);
    }
    const user = await c.req.json();
    try {
        const searchUser = await getUserByIdService(id);
        if(searchUser === undefined){
            return c.json({message: 'User not found'}, 404);
        }
        //update
        const res = await updateUserService(id, user);
        if(!res){
            return c.json({message: 'User not updated'}, 400);
        }
        return c.json({message: res}, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
        
    }
}


export const deleteUser = async(c: Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)){
        return c.json({error: 'Invalid id'}, 400);
    }
    try {
        const searchUser = await getUserByIdService(id);
        if(searchUser === undefined){
            return c.json({message: 'User not found'}, 404);
        }
        const res = await deleteUserService(id);
        if(!res){
            return c.json({message: 'User not deleted'}, 400);
        }
        return c.json({message: res}, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
        
    }
}