import db from "../drizzle/db";
import { eq, sql } from "drizzle-orm";
import { vehicleTable } from "../drizzle/schema";

//create vehicle
export const createVehicleService = async (vehicle: any) => {
    console.log("Creating Vehicle with Data:", vehicle); // ✅ Debug insertion payload

    // ✅ Check if a vehicle with the same registration number exists
    const existingVehicle = await db.query.vehicleTable.findFirst({
        where: eq(vehicleTable.registration_number, vehicle.registration_number)
    });

    if (existingVehicle) {
        console.log("Vehicle already exists:", existingVehicle);
        return null; // Prevents duplicate insertion
    }

    const result = await db.insert(vehicleTable).values(vehicle)
        .returning({
            registration_number: vehicleTable.registration_number,
        })
        .execute();

    console.log("Created Vehicle Response:", result); // ✅ Debug output after insertion
    return result;
};


// Fetch all vehicles
export const getAllVehiclesService = async () => {
    const vehicles = await db.query.vehicleTable.findMany();
    console.log("Vehicles Retrieved:", vehicles);
    return vehicles;
}


// fetch vehicle by registration number
export const getVehicleByRegNumber = async (registration_number: string) => {
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