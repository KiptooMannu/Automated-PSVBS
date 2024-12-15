import db from "../drizzle/db";
import { eq, sql } from "drizzle-orm";
import { vehicleTable } from "../drizzle/schema";

//create vehicle
export const createVehicleService = async (vehicle: any) => {
    return await db.insert(vehicleTable).values(vehicle)
    .returning({registration_number: vehicleTable.registration_number})
    .execute();
}
// Fetch all vehicles
export const getAllVehiclesService = async () => {
    return await db.query.vehicleTable.findMany();
}
// fetch vehicle by registration number
export const getVehicleByRegNumberService = async (registration_number: string) => {
return await db.query.vehicleTable.findFirst({
    where : eq(vehicleTable.registration_number, registration_number)
})
}
// update vehicle by registration number
export const updateVehicleService = async (registration_number: string, vehicle: any) => {
    return await db.update(vehicleTable).set(vehicle).where(eq(vehicleTable.registration_number, registration_number)).execute();
}
//delete vehicle by registration number
export const deleteVehicleService = async (registration_number: string) => {
    await db.delete(vehicleTable).where(eq(vehicleTable.registration_number, registration_number));
    return "Vehicle deleted successfully";
}