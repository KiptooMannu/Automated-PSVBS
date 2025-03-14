import  db  from "../../src/drizzle/db";
import { routesTable } from "../../src/drizzle/schema";
import { eq } from "drizzle-orm";

// Get all routes
export const getRoutes = async () => {
  return await db.query.routesTable.findMany();
};

// Get a route by ID
export const getRouteById = async (routeId: number) => {
  return await db.query.routesTable.findFirst({
    where: eq(routesTable.route_id, routeId),
  });
};

// Create a new route
export const createRoute = async (routeData: typeof routesTable.$inferInsert) => {
  const [newRoute] = await db.insert(routesTable).values(routeData).returning();
  return newRoute;
};

// Update a route
export const updateRoute = async (routeId: number, routeData: Partial<typeof routesTable.$inferInsert>) => {
  const [updatedRoute] = await db
    .update(routesTable)
    .set(routeData)
    .where(eq(routesTable.route_id, routeId))
    .returning();
  return updatedRoute;
};

// Delete a route
export const deleteRoute = async (routeId: number) => {
  await db.delete(routesTable).where(eq(routesTable.route_id, routeId));
};