import db from "../drizzle/db";
import { eq, or } from "drizzle-orm";
import { vehicleTable } from "../drizzle/schema";

// Create vehicle
export const createVehicleService = async (vehicle: any) => {
  console.log("Creating Vehicle with Data:", vehicle);

  // Check if a vehicle with the same registration number or license plate exists
  const existingVehicle = await db.query.vehicleTable.findFirst({
    where: or(
      eq(vehicleTable.registration_number, vehicle.registration_number),
      eq(vehicleTable.license_plate, vehicle.license_plate)
    ),
  });

  if (existingVehicle) {
    console.log("Vehicle already exists:", existingVehicle);
    return null; // Prevents duplicate insertion
  }

  const result = await db
    .insert(vehicleTable)
    .values(vehicle)
    .returning({
      registration_number: vehicleTable.registration_number,
      license_plate: vehicleTable.license_plate,
    })
    .execute();

  console.log("Created Vehicle Response:", result);
  return result;
};

// Fetch all vehicles
export const getAllVehiclesService = async () => {
  const vehicles = await db.query.vehicleTable.findMany();
  console.log("Vehicles Retrieved:", vehicles);
  return vehicles;
};

// Fetch vehicle by registration number
export const getVehicleByRegNumber = async (registration_number: string) => {
  return await db.query.vehicleTable.findFirst({
    where: eq(vehicleTable.registration_number, registration_number),
  });
};

// Update vehicle by registration number
export const updateVehicleService = async (registration_number: string, vehicle: any) => {
  return await db
    .update(vehicleTable)
    .set(vehicle)
    .where(eq(vehicleTable.registration_number, registration_number))
    .execute();
};

// Delete vehicle by registration number
export const deleteVehicleService = async (registration_number: string) => {
  await db
    .delete(vehicleTable)
    .where(eq(vehicleTable.registration_number, registration_number))
    .execute();
  return "Vehicle deleted successfully";
};

// Check if a vehicle with the same registration number or license plate exists
export const checkVehicleExistsService = async (registration_number: string, license_plate: string) => {
  return await db.query.vehicleTable.findFirst({
    where: or(
      eq(vehicleTable.registration_number, registration_number),
      eq(vehicleTable.license_plate, license_plate)
    ),
  });
};