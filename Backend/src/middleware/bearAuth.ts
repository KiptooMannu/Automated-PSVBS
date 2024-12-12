import "dotenv/config";
import { verify } from "hono/jwt";
import { Context, Next } from "hono";

interface HonoRequest<T, U> {
    user?: T;
}

// AUTHENTICATION MIDDLEWARE
export const verifyToken = async (token: string, secret: string) => {
    try {
        const decoded = await verify(token as string, secret);
        return decoded;
    } catch (error: any) {
        return null;
    }
}

// AUTHORIZATION MIDDLEWARE
export const authMiddleware = async (
    c: Context & { req: HonoRequest<any, unknown> },
    next: Next,
    requiredRole: string
) => {
    const token = c.req.header("Authorization");

    if (!token) return c.json({ error: "Token is required" }, 401);
    const decoded = await verifyToken(token as string, process.env.JWT_SECRET as string);

    if (!decoded) return c.json({ error: "Invalid token" }, 401);

    // Check specific roles
    const allowedRoles = [
        "user",
        "admin",
        "super_admin"
    ];

    if (allowedRoles.includes(requiredRole) && decoded.role === requiredRole) {
        return await next();
    }

    // Handle "all" case: allows all specified roles
    if (requiredRole === "all" && allowedRoles.includes(decoded.role as string)) {
        return await next();
    }

    return c.json({ error: "Unauthorized" }, 401);
}

// Role-based Authorization Functions
export const userRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "user");
export const adminRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "admin");
export const superAdminRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "super_admin");
// Any role among user, admin, super_admin
export const allRolesAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "all");
