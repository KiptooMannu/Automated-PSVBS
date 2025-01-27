// import React, { useState } from 'react';
// import { Toaster } from 'sonner';
// import { useGetSeatsQuery } from '../../../../features/seats/seatsAPI';
// import { useNavigate } from 'react-router-dom';
// import { useForm, SubmitHandler, useWatch } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { RootState } from '../../../../app/store';
// import { useSelector } from 'react-redux';
// import { Link, useParams } from 'react-router-dom';
// import { useGetVehicleByIdQuery} from '../../../../features/vehicles/vehicleAPI';
// import { useCreateBookingVehicleMutation} from '../../../../features/booking/bookingAPI';
// import { bookingVehicleAPI } from '../../../../features/booking/bookingAPI';
// import { vehicleAPI } from '../../../../features/vehicles/vehicleAPI';
// import { toast } from 'sonner';
// import { Vehicle } from '../../../../features/vehicles/vehicleAPI';


// interface MapSeatModalProps {
//   vehicle: Vehicle;
//   onClose: () => void;
// }
// // interface SeatData {}
// console.log('vehicle in mapseatpage', Vehicle);
// interface bookingData{
//   seat_number: string;
//   booking_date: string;
//   booking_time: string;
//   departure_time: string;
//   booking_status: string;
// }

// const schema = yup.object().shape({
//   seat_number: yup.string().required('Seat number is required'),
//   booking_date: yup.string().required('Booking date is required'),
//   booking_time: yup.string().required('Booking time is required'),
//   departure_time: yup.string().required('Departure time is required'),
//   booking_status: yup.string().required('Booking status is required')
// });

// const MapSeatModal: React.FC<MapSeatModalProps> = ({ onClose }) => {
//   const user = useSelector((state: RootState) => state.user);
//   // const { registration_number } = useParams<{ registration_number: string }>();
//   // const parsedRegistrationNumber = registration_number ? parseInt(registration_number, 10) : NaN;
//   const { registration_number } = useParams<{ registration_number: string }>();
//   console.log('registration number', registration_number);


//   const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
//   const [isBooking, setIsBooking] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   //fetch seats
//   const { data: seatsData, isLoading } = useGetSeatsQuery();
//   // console.log(seatsData);
//   const navigate = useNavigate();
//   //fetch 
//   // const { data: vehicleData, isLoading: vehicleLoading, error: vehicleError } = vehicleAPI.useGetVehicleByIdQuery(parsedRegistrationNumber);
//   const { 
//     data: vehicleData, 
//     isLoading: vehicleLoading, 
//     error: vehicleError 
//   } = vehicleAPI.useGetVehicleByIdQuery(registration_number || "");

//    console.log('vehicle data for booking', vehicleData);
//    const [bookingDetails] = bookingVehicleAPI.useCreateBookingVehicleMutation();
//    const [isSubmitting, setIsSubmitting] = useState(false);

//    const externalData = {
//     user_id: user.user?.user_id
//     // registration_number: 
//   };
//   const { register, handleSubmit,formState: { errors }} = useForm<bookingData>({ resolver: yupResolver(schema) });


//   // Transform seats into a grid structure (5 seats per row)
//   // const seats = seatsData
//   //   ? seatsData.reduce((rows: string[][], seat: any, index: number) => {
//   //       const rowIndex = Math.floor(index / 5);
//   //       if (!rows[rowIndex]) rows[rowIndex] = [];
//   //       rows[rowIndex].push(seat.seat_number);
//   //       return rows;
//   //     }, [])
//   //   : [];

//   // const handleSeatClick = (seat: string) => {
//   //   setSelectedSeats((prevSelected) =>
//   //     prevSelected.includes(seat)
//   //       ? prevSelected.filter((selected) => selected !== seat)
//   //       : [...prevSelected, seat]
//   //   );
//   // };

//   const onSubmit: SubmitHandler<bookingData> = async (formData) => {
//     const dataToSubmit = {
//       ...externalData,
//       ...formData
//   }
  
//   try {
//     setIsSubmitting(true);
//    await bookingDetails(dataToSubmit).unwrap();
//     toast.success("Booking created successfully");

//     setTimeout(() => {
//       navigate('/dashboard/payments');
//     }, 1000);

//   } catch (err) {
//     toast.error("Error creating booking");
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   if (isLoading) return <p>Loading seats...</p>;
//   // if (apiError) return <p>Error loading seats: {apiError}</p>;
//   if (isLoading) return <div>Loading...</div>;
//   if (!vehicle) {
//     return <div>No vehicle data available</div>;
//   }
  

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <Toaster />
//       <div className="bg-blue-500 p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-3/4 max-h-screen overflow-auto">
//         <h2 className="text-xl font-bold mb-4">Select Seats</h2>
//         {/* Seat Grid */}
//         {/* <div className="grid grid-cols-5 gap-4">
//           {seats.map((row, rowIndex) => (
//             <div key={rowIndex} className="flex justify-center space-x-4">
//               {row.map((seat) => (
//                 <button
//                   key={seat}
//                   className={`btn btn-sm ${
//                     selectedSeats.includes(seat) ? 'btn-success' : 'btn-outline'
//                   }`}
//                   onClick={() => handleSeatClick(seat)}
//                 >
//                   {seat}
//                 </button>
//               ))}
//             </div>
//           ))}
//         </div> */}

//         {/* Selected Seats Info */}
//         <div className="mt-7">
//           <h2 className="text-xl font-semibold text-center">Selected Seats</h2>
//           <p className="text-lg text-center">
//             {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
//           </p>
//           <p className="text-center">Total Seats: {selectedSeats.length}</p>
//           <p className="text-center">Total Amount: ${selectedSeats.length * 10}</p>
//         </div>

//         {/* Error Message */}
//         {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

//         {/* form */}
//         {vehicleData && vehicleData.is_active ? (
//         <>
//           <h1 className="text-xl font-bold mb-4 text-webcolor text-center p-5">Booking Vehicle</h1>
//           <div className="p-5 rounded-lg card lg:w-3/4 border-2 bg-zinc-50 m-auto">
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <div className="flex flex-col lg:flex-row space-x-4 w-full">
//                 <div className="form-control lg:w-1/2">
//                   <label htmlFor="booking_date" className="label">Booking Date</label>
//                   <input type="date" id="booking_date" className="input input-bordered" {...register("booking_date")} />
//                   <p className="text-red-500">{errors.booking_date?.message}</p>
//                 </div>
//                 <div className="form-control lg:w-1/2">
//                   <label htmlFor="return_date" className="label">Departure Time</label>
//                   <input type="date" id="return_date" className="input input-bordered" {...register("departure_time")} />
//                   <p className="text-red-500">{errors.departure_time?.message}</p>
//                 </div>
//                 {/* <div className="form-control lg:w-1/2">
//                   <label htmlFor="return_date" className="label">seat_number</label>
//                   <input type="date" id="return_date" className="input input-bordered" {...register("seat_number")} />
//                   <p className="text-red-500">{errors.seat_number?.message}</p>
//                 </div> */}
//                 {/* <div className="form-control lg:w-1/2">
//                   <label htmlFor="return_date" className="label">seat_number</label>
//                   <input type="date" id="return_date" className="input input-bordered" {...register("seat_number")} />
//                   <p className="text-red-500">{errors.seat_number?.message}</p>
//                 </div> */}
//               </div>

//               <div className="form-control mt-4">
//                 <button type="submit" className="btn bg-webcolor text-text-light hover:text-black border-none w-1/4 m-auto" >
//                   {isSubmitting ? (
//                     <>
//                       <span className="loading loading-spinner text-text-light"></span>
//                       <span className='text-text-light'>Submitting...</span>
//                     </>
//                   ) : (
//                     "Create Booking"
//                   )}
//                 </button>
//                 <button
//             type="button"
//             onClick={onClose}
//             className="btn bg-gray-300 text-gray-800 hover:text-gray-900"
//           >
//             Cancel
//             </button>
//               </div>
//             </form>
//           </div>
//         </>
//       ) : (
//         <div className="text-center p-5">
//           <p className="text-xl">Vehicle is not available for booking</p>
//           <button
//             type="button"
//             onClick={onClose}
//             className="btn bg-gray-300 text-gray-800 hover:text-gray-900"
//           >
//             Cancel
//             </button>
//         </div>
//       )}

//         {/* Buttons */}
//         {/* <div className="flex justify-end mt-4 space-x-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="btn bg-gray-300 text-gray-800 hover:text-gray-900"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`btn ${
//               isBooking ? 'bg-gray-400' : 'bg-webcolor'
//             } text-text-light hover:text-black border-none`}
//             disabled={isBooking}
//           >
//             {isBooking ? 'Booking...' : 'Book Now'}
//           </button>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default MapSeatModal;

import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';
import { Vehicle } from '../../../../features/vehicles/vehicleAPI';
import { useCreateBookingVehicleMutation } from '../../../../features/booking/bookingAPI';
import { toast } from 'sonner';

interface MapSeatModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

interface BookingData {
  seat_number: string;
  booking_date: string;
  booking_time: string;
  departure_time: string;
  booking_status: string;
}

const schema = yup.object().shape({
  seat_number: yup.string().required('Seat number is required'),
  booking_date: yup.string().required('Booking date is required'),
  // booking_time: yup.string().required('Booking time is required'),
  // departure_time: yup.string().required('Departure time is required'),
  // booking_status: yup.string().required('Booking status is required'),
  departure: yup.string().required('Departure is required'),
  destination: yup.string().required('Destination is required'),
  // estimated_arrival: yup.string().required('Estimated arrival time is required'),
  price: yup.number().required('Price is required'),
  // total_price: yup.number().required('Total price is required')
});

const MapSeatModal: React.FC<MapSeatModalProps> = ({ vehicle, onClose }) => {
  const user = useSelector((state: RootState) => state.user);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const [createBooking] = useCreateBookingVehicleMutation();

  const externalData = {
    user_id: user.user?.user_id
  };

  const { register, handleSubmit, formState: { errors } } = useForm<BookingData>({
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<BookingData> = async (formData) => {
    const dataToSubmit = {
      ...externalData,
      ...formData
    };

    try {
      setIsSubmitting(true);
      await createBooking(dataToSubmit).unwrap();
      toast.success("Booking created successfully");

      setTimeout(() => {
        navigate('/dashboard/payments');
      }, 1000);
    } catch (err) {
      toast.error("Error creating booking");
    } finally {
      setIsSubmitting(false);
    }
  };
   const calculateRemainingSeats = (vehicle: Vehicle) => {
      //logic is vehicle.capacity - booked seats
      // if booked seats is not available then vehicle.capacity
      const bookedSeats = 0;
      if (vehicle.capacity - bookedSeats > 0) {
        return vehicle.capacity - bookedSeats;
      } else {
        return vehicle.capacity;
      }
    };
    console.log('remaining seats', calculateRemainingSeats(vehicle));
    const remainingSeats = calculateRemainingSeats(vehicle);
    // calculate total amount
    



  if (!vehicle) {
    return <div>No vehicle data available</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster />
      <div className="bg-blue-500 p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-3/4 max-h-screen overflow-auto">
        <h2 className="text-xl font-bold mb-4">Select Seats</h2>
        
        {/* Selected Seats Info */}
        <div className="mt-7">
          <h2 className="text-xl font-semibold text-center">Selected Seats</h2>
          <p className="text-lg text-center">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
          </p>
          <p className="text-center">Total Seats: {selectedSeats.length}</p>
          <p className="text-center">Total Amount: ${selectedSeats.length * 10}</p>
        </div>

        {/* Error Message */}
        {errors && <p className="text-red-500 text-sm mt-4">{errors.seat_number?.message}</p>}

        {/* form */}
        {vehicle.is_active ? (
          <>
            <h1 className="text-xl font-bold mb-4 text-webcolor text-center p-5">Booking Vehicle</h1>
            <p className='text-2xl text-center'><strong>Remaining Seats:{remainingSeats}</strong></p>
            <div className="p-5 rounded-lg card lg:w-3/4 border-2  bg-blue-300  m-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col lg:flex-row space-x-4 w-full">
                  <div className="form-control lg:w-1/2">
                    <label htmlFor="booking_date" className="label">Departure Date</label>
                    <input type="date" id="booking_date" className="input input-bordered" {...register("booking_date")} />
                    <p className="text-red-500">{errors.booking_date?.message}</p>
                  </div>
                  <div className="form-control lg:w-1/2">
                    <label htmlFor="departure_time" className="label">Departure Time</label>
                    <input type="time" id="departure_time" className="input input-bordered" {...register("departure_time")} />
                    <p className="text-red-500">{errors.departure_time?.message}</p>
                  </div>
                </div>

                <div className="flex justify-between mt-6 space-x-2">
                  <button type="submit" className="btn bg-webcolor text-text-light hover:text-black border-none w-1/4 m-auto">
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner text-text-light"></span>
                        <span className='text-text-light'>Submitting...</span>
                      </>
                    ) : (
                      "Create Booking"
                    )}
                  </button>
                  <button type="button" onClick={onClose} className="btn bg-gray-300 text-gray-800 hover:text-gray-900">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center p-5">
            <p className="text-xl">Vehicle is not available for booking</p>
            <button type="button" onClick={onClose} className="btn bg-gray-300 text-gray-800 hover:text-gray-900">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSeatModal;
