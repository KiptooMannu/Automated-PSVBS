import { Context, Hono, Next} from "hono";

import { 
    insertVehicle,
    listAllVehicles,
    getAllVehicleByRegNo,
    updateVehicleByRegNo,
    deleteVehicleByRegNo
 } from "./vehicle.controllers";

import { 
  userRoleAuth,
  adminRoleAuth
 } from "../middleware/bearAuth";

// Create Hono app instance
const vehicleRouter = new Hono();

// Define middleware to check user role
const roleAuthChain = (...middlewares: any) => {
        return async (c: Context, next: Next) => {
            for (const middleware of middlewares) {
                let isAuthorized = false;
    
                // Middleware runs, and if it authorizes, it sets `isAuthorized` to true
                await middleware(c, async () => {
                    isAuthorized = true;
                });
    
                if (isAuthorized) {
                    return next(); // Authorized, proceed to next handler
                }
            }
            // If no middleware authorizes the user, return 401
            return c.json({ error: "Unauthorized" }, 401);
        };
    };

// Define routes
vehicleRouter
    .post("/vehicles", insertVehicle)          // Route to create a new vehicle
    .get("/vehicles", listAllVehicles)          // Route to get all vehicles
    .get("/vehicles/:registration_number", getAllVehicleByRegNo)      // Route to get a specific vehicle by registration number
    .put("/vehicles/:registration_number", updateVehicleByRegNo)       // Route to update a vehicle
    .delete("/vehicles/:registration_number", deleteVehicleByRegNo);   // Route to delete a vehicle
//export the app
export default vehicleRouter;
