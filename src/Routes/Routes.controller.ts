import { Context } from "hono";
import { getRoutes, createRoute, getRouteById, updateRoute, deleteRoute } from "./Routes.Service";
// import { routeSchema } from "../db/schema";

// Get all routes
export const getAllRoutes = async (c: Context) => {
  try {
    const routes = await getRoutes();
    return c.json({ success: true, data: routes });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Get a route by ID
export const getRoute = async (c: Context) => {
  const routeId = c.req.param("routeId");
  try {
    const route = await getRouteById(parseInt(routeId));
    if (!route) {
      return c.json({ success: false, message: "Route not found" }, 404);
    }
    return c.json({ success: true, data: route });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Create a new route
export const addRoute = async (c: Context) => {
  const routeData = await c.req.json();
  try {
    const newRoute = await createRoute(routeData);
    return c.json({ success: true, data: newRoute }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Update a route
export const modifyRoute = async (c: Context) => {
  const routeId = c.req.param("routeId");
  const routeData = await c.req.json();
  try {
    const updatedRoute = await updateRoute(parseInt(routeId), routeData);
    if (!updatedRoute) {
      return c.json({ success: false, message: "Route not found" }, 404);
    }
    return c.json({ success: true, data: updatedRoute });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Delete a route
export const removeRoute = async (c: Context) => {
  const routeId = c.req.param("routeId");
  try {
    await deleteRoute(parseInt(routeId));
    return c.json({ success: true, message: "Route deleted successfully" });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};