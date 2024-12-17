import { Context } from 'hono';
import { getAllSeatsService,
    getSeatByIdService as getSeatByIdService,
    createSeatService as createSeatService,
    updateSeatService as updateSeatService,
    deleteSeatService as deleteSeatService,
    getSeatByVehicleIdService as getSeatByVehicleIdService 
} from './seat.service';

//create seat
export const insertVehicleController = async (c: Context) => {
    try {
        const seat = await c.req.json();
        const createdSeat = await createSeatService(seat);
        if (createdSeat === undefined) return c.json({msg:"Seat not created 😒 "}, 400);
        return c.json(createdSeat, 201);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//get all seats
export const listAllSeatsController = async (c: Context) => {
    try {
        const seats = await getAllSeatsService();
        if (seats === null) return c.json({msg:"No seats found😒"}, 404);
        return c.json(seats, 200);
    } catch (error: any) {
        return c.json({msg:"Error while fetching seats😒"}, 400);
    }
}

//get seat by ID
export const getSeatByIdController = async (c: Context) =>{
    const seat_id = c.req.param("seat_id");
    try{
        if(!seat_id) return c.text("Invalid seat id", 400);
        const seat = await getSeatByIdService(parseInt(seat_id));
        if(seat===undefined) return c.json({message: "No seat found for this seat id😒"},404);
        return c.json(seat, 200);

    } catch(error){
        return c.json({msg:"Error while fetching seat by id😒"}, 400);
    }
}

//update seat by seat id
export const updateSeatByIdController = async (c: Context) => {
    try {
        const seat_id = Number(c.req.param("seat_id")); // Convert to number
        if (isNaN(seat_id)) return c.json({ message: "Invalid Seat ID" }, 400); 

        const seatData = await c.req.json(); 
        const result = await updateSeatService(seat_id, seatData); 
        return c.json({ message: result }, 200);
    } catch (error: any) {
        console.error("Error updating seat:", error);
        return c.json({ message: "Error updating seat", error: error.message || error }, 500);
    }
};



//delete seat by ID
export const deleteSeatByIdController = async (c: Context) => {
    const seat_id = c.req.param("seat_id");
    try {
        if(!seat_id) return c.text("Invalid seat id😒", 400);
        //search for seat by id
        const seat = await getSeatByIdService(parseInt(seat_id));
        if(seat===undefined) return c.json({message: "No seat found with this id😒"},404);
        // delete seat by id
        const deletedSeat = await deleteSeatService(parseInt(seat_id));
        if (deletedSeat === undefined) return c.json({msg:"Seat not deleted 😒 "}, 400);
        return c.json(deletedSeat, 200);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//get seat by vehicle id
export const getSeatByVehicleIdController = async (c: Context) =>{
    const vehicle_id = c.req.param("vehicle_id");
    try{
        if(!vehicle_id) return c.text("Invalid vehicle id", 400);
        const seat = await getSeatByVehicleIdService(vehicle_id);
        if(seat===undefined) return c.json({message: "No seat found for this vehicle id😒"},404);
        return c.json(seat, 200);

    } catch(error){
        return c.json({msg:"Error while fetching seat by vehicle id😒"}, 400);
    }
}
