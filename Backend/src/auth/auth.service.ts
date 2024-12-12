import db  from "../drizzle/db";
// import { Roles,UserRoles, userTable } from "../drizzle/schema";
import { sql} from "drizzle-orm";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { registerSchema,loginSchema} from "../validators/user.validator";


type User ={
    user_id?: number;
    username: string;
    email: string;
    password: string;
}

const secret = process.env.SECRET;
const expiresIn = process.env.EXPIRESIN;


export const registerUser = async (user: User) => {
    registerSchema.parse(user);

    //check if user already exists
    const existingUser = await db.select().from(userTable).where(eq(userTable.email, user.email)).execute();
    console.log(user)
    if(existingUser.length > 0){
        throw new Error("User already exists");
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create user
    const newUser = await db.insert(userTable).values({
        ...user,
        password: hashedPassword,
    }).returning({ id: userTable.user_id }).execute();

    const userId = newUser[0].id;

    // Insert default role for the user
    const newRole = await db.insert(Roles).values({
        role_name: 'user',
        permissions: ''
    }).returning({ id: Roles.role_id }).execute();

    const roleId = newRole[0].id;

    try {
        await db.insert(UserRoles).values({
            user_id: userId,
            role_id: roleId
        }).execute();

        return 'User created successfully';
    } catch (err) {
        throw new Error('Registration failed. Please try again later.');
    }
};

export const loginUser = async (email: string, password: string) => {
    loginSchema.parse({email, password});

    const users = await db.select().from(userTable).where(eq(userTable.email, email)).execute();

    if (users.length === 0) {
        throw new Error('User not found! Try Again');
    }
    const user = users[0];

    //fetch users password
    const auths = await db.select().from(userTable).where(eq(userTable.user_id, user.user_id)).execute();

    if(auths.length === 0){
        throw new Error('User not found! Try Again');
    }

    const auth = auths[0];

    //validate the provided password
    const isPasswordValid = await bcrypt.compare(password, auth.password);

    if(!isPasswordValid){
        throw new Error('Invalid credentials try again');
    }

    //fetch the users role
    const usersRole = await db.select({role_name: Roles.role_name})
    .from(UserRoles)
    .innerJoin(Roles, eq(UserRoles.role_id, Roles.role_id))
    .where(eq(UserRoles.user_id, user.user_id))
    .execute();
    

    if (usersRole.length === 0) {
        throw new Error('User role not found!');
    }
    
    const role = usersRole[0].role_name;
    //create a jwt token
    const token = jwt.sign({id: user.user_id, email: user.email, role}, secret!, {expiresIn});
    return {token, user}
};





//get all users
export const getUsersService = async (limit?:number): Promise<TIUsers[] | null> => {
    if(limit){
        return await db.query.userTable.findMany({
            limit:limit
        });
    }
    return await db.query.userTable.findMany();
}

//get single user by id
export const getUserByIdService = async (id: number): Promise<TSUsers | undefined> =>{
    return await db.query.userTable.findFirst({
        where:eq(userTable.user_id, id),
    });
}

export const updateUserService  = async (id: number, user: TIUsers): Promise<string> => {
    if(user.password){
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
    }
 await db.update(userTable).set(user).where(eq(userTable.user_id, id)).execute();
    return 'User updated successfully';
}

export const deleteUserService = async (id: number): Promise<string> => {
    await db.delete(userTable).where(eq(userTable.user_id, id)).execute();
    return 'User deleted successfully';
}