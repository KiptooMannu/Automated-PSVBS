import { Context } from "hono";
import { createVehicleService,getAllVehiclesService,getVehicleByRegNumber,updateVehicleService,deleteVehicleService} from "./vehicle.services";

//insert vehicle
export const insertVehicle = async (c: Context) => {
    try {
        const vehicle = await c.req.json();
        const createdVehicle = await createVehicleService(vehicle);
        if (createdVehicle === undefined) return c.json({msg:"Vehicle not created 😒 "}, 400);
        return c.json(createdVehicle, 201);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}
//get all vehicles
//get vehicle by Reg no
export const listAllVehicles = async (c: Context) => {
    try {
        const vehicles = await getAllVehiclesService();
        if (!vehicles || vehicles.length === 0) return c.json({ msg: "No vehicles found 😒" }, 404);

        // ✅ Ensure unique vehicles based on registration_number
        const uniqueVehicles = Array.from(
            new Map(vehicles.map(vehicle => [vehicle.registration_number, vehicle])).values()
        );

        return c.json(uniqueVehicles, 200);
    } catch (error: any) {
        console.log(`Error: ${error}`);
        return c.json({ msg: "Error while fetching vehicles 😒" }, 400);
    }
};



// update vehicle by regno
export const updateVehicleByRegNo = async (c: Context) => {
    try {
        const reg_no = c.req.param("registration_number");
        const vehicle = await c.req.json();
        if(!reg_no) return c.text("Invalid registration id", 400);
        //search for vehicle by regno
        const existingVehicle = await getVehicleByRegNumber(reg_no);
        if(existingVehicle===undefined) return c.json({message: "No vehicle found with this reg no😒"},404);
        // update vehicle by regno
        const updatedVehicle = await updateVehicleService(reg_no, vehicle);
        if (updatedVehicle === undefined) return c.json({msg:"Vehicle not updated 😒 "}, 400);
        return c.json(updatedVehicle, 200);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}


export const getAllVehicleByRegNo = async (c: Context) => {
    try {
        const reg_no = c.req.param("registration_number");
        if (!reg_no) return c.text("Invalid registration id 😒", 400);

        const vehicle = await getVehicleByRegNumber(reg_no);
        if (!vehicle) return c.json({ msg: "No vehicle found with this reg no 😒" }, 404);

        return c.json(vehicle, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
};

//delete vehicle by regno
export const deleteVehicleByRegNo = async (c: Context) => {
    const reg_no = c.req.param("registration_number");
    try {
        if(!reg_no) return c.text("Invalid registration id😒", 400);
        //search for vehicle by regno
        const existingVehicle = await getVehicleByRegNumber(reg_no);
        if(existingVehicle===undefined) return c.json({message: "No vehicle found with this reg no😒"},404);
        // delete vehicle by regno
        const deleteVehicle = await deleteVehicleService(reg_no);
        if (deleteVehicle === undefined) return c.json({msg:"Vehicle not deleted 😒 "}, 400);
        return c.json({msg:deleteVehicle}, 200);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}