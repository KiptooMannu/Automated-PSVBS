import { Hono } from "hono";
import {
  getAllRoutes,
  getRoute,
  addRoute,
  modifyRoute,
  removeRoute,
} from "./Routes.controller";

const routerRouter = new Hono();

// Get all routes
routerRouter.get("/", getAllRoutes);

// Get a route by ID
routerRouter.get("/:routeId", getRoute);

// Create a new route
routerRouter.post("/", addRoute);

// Update a route
routerRouter.put("/:routeId", modifyRoute);

// Delete a route
routerRouter.delete("/:routeId", removeRoute);

export default routerRouter;