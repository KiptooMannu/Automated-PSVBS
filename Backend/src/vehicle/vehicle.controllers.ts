import { Context } from "hono";
import { createVehicleService,getAllVehiclesService,getVehicleByRegNumberService,updateVehicleService,deleteVehicleService} from "./vehicle.services";

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
export const listAllVehicles = async (c: Context) => {
    try {
        const vehicles = await getAllVehiclesService();
        if (vehicles === null) return c.json({msg:"No vehicles found😒"}, 404);
        return c.json(vehicles, 200);
    } catch (error: any) {
        return c.json({msg:"Error while fetching vehicles😒"}, 400);
    }
}
//get vehicle by Reg no
export const getAllVehicleByRegNo = async (c: Context) =>{
    const reg_no = c.req.param("registration_number");
    try{
        if(!reg_no) return c.text("Invalid license plate", 400);
        const vehicle = await getVehicleByRegNumberService(reg_no);
        if(vehicle===undefined) return c.json({message: "No vehicle found for this license plate😒"},404);
        return c.json(vehicle, 200);

    } catch(error){
        return c.json({msg:"Error while fetching vehicles by reg no😒"}, 400);
    }
}
// update vehicle by regno
export const updateVehicleByRegNo = async (c: Context) => {
    try {
        const reg_no = c.req.param("registration_number");
        const vehicle = await c.req.json();
        if(!reg_no) return c.text("Invalid registration id", 400);
        //search for vehicle by regno
        const existingVehicle = await getVehicleByRegNumberService(reg_no);
        if(existingVehicle===undefined) return c.json({message: "No vehicle found with this reg no😒"},404);
        // update vehicle by regno
        const updatedVehicle = await updateVehicleService(reg_no, vehicle);
        if (updatedVehicle === undefined) return c.json({msg:"Vehicle not updated 😒 "}, 400);
        return c.json(updatedVehicle, 200);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}
//delete vehicle by regno
export const deleteVehicleByRegNo = async (c: Context) => {
    const reg_no = c.req.param("registration_number");
    try {
        if(!reg_no) return c.text("Invalid registration id😒", 400);
        //search for vehicle by regno
        const existingVehicle = await getVehicleByRegNumberService(reg_no);
        if(existingVehicle===undefined) return c.json({message: "No vehicle found with this reg no😒"},404);
        // delete vehicle by regno
        const deleteVehicle = await deleteVehicleService(reg_no);
        if (deleteVehicle === undefined) return c.json({msg:"Vehicle not deleted 😒 "}, 400);
        return c.json({msg:deleteVehicle}, 200);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}