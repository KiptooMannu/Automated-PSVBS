import { useState } from 'react';
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
// import { useGetSeatsQuery } from '../../../../features/seats/seatsAPI';

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
  // seat_number: yup.string().required('Seat number is required'),
  booking_date: yup.string().required('Booking date is required'),
  booking_time: yup.string().required('Booking time is required'),
  // departure_time: yup.string().required('Departure time is required'),
  // booking_status: yup.string().required('Booking status is required'),
  departure: yup.string().required('Departure is required'),
  destination: yup.string().required('Destination is required'),
  // estimated_arrival: yup.string().required('Estimated arrival time is required'),
  price: yup.number().required('Price is required'),
  total_price: yup.number().required('Total price is required')
});

const MapSeatModal: React.FC<MapSeatModalProps> = ({ vehicle, onClose }) => {
  const user = useSelector((state: RootState) => state.user);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   //fetch seats
  // const { data: seatsData, isLoading } = useGetSeatsQuery();
  // console.log(seatsData);
  const seatsData = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]

  const navigate = useNavigate();
  const [createBooking] = useCreateBookingVehicleMutation();
  // console.log('create booking:' ,createBooking);

  const externalData = {
    user_id: user.user?.user_id,
    vehicle_id: vehicle.registration_number,
    seat_id: 1,//edit this
    departure: vehicle.departure,
    destination: vehicle.destination,
  };
  console.log('external data', externalData);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingData>({
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<BookingData> = async (formData) => {
    const dataToSubmit = {
      ...externalData,
      ...formData
    };
    console.log("Payload:", dataToSubmit);

    try {
      setIsSubmitting(true);
      await createBooking(dataToSubmit).unwrap();
      console.log("Data to submit:", dataToSubmit);
      toast.success("Booking created successfully");

      setTimeout(() => {
        navigate('/dashboard/payments');
      }, 1000);
    } catch (err) {
      toast.error("Error creating booking");
      console.error("Error creating booking:", err);
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
  // console.log('remaining seats', calculateRemainingSeats(vehicle));
  const remainingSeats = calculateRemainingSeats(vehicle);

  // calculate total amount
  const calculateTotalAmount = (vehicle:Vehicle)=> {
    const seatPrice =  vehicle.cost;
    return selectedSeats.length * seatPrice;
  }
  const TotalPay = calculateTotalAmount(vehicle);
  console.log(TotalPay);


  //
  // Transform seats into a grid structure (5 seats per row)
  const seats = seatsData
    ? seatsData.reduce((rows: string[][], seat: any, index: number) => {
      const rowIndex = Math.floor(index / 5);
      if (!rows[rowIndex]) rows[rowIndex] = [];
      rows[rowIndex].push(seat.seat_number);
      return rows;
    }, [])
    : [];


  const handleSeatClick = (seat: string) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((selected) => selected !== seat)
        : [...prevSelected, seat]
    );
  };




  if (!vehicle) {
    return <div>No vehicle data available</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster />
      <div className="bg-blue-50 p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-3/4 max-h-screen overflow-auto">
        <h2 className="text-xl font-bold mb-4">Select Seats</h2>

        <div className="grid grid-cols-7 gap-2 justify-center p-4 bg-black">
          {seatsData.map((seat) => (
            <button
              key={seat}
              className={`p-2 rounded-lg border ${selectedSeats.includes(seat) ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat}
            </button>
          ))}
        </div>


        {/* Selected Seats Info */}
        <div className="mt-7">
          <h2 className="text-xl font-semibold text-center">Selected Seats</h2>
          <p className="text-lg text-center">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
          </p>
          <p className="text-center">Total Seats: {selectedSeats.length}</p>
          <p className="text-center">Total Amount: {}</p>
        </div>

        {/* Error Message */}
        {errors && <p className="text-red-500 text-sm mt-4">{errors.seat_number?.message}</p>}

        {/* form */}
        {vehicle.is_active ? (
          <>
            <h1 className="text-xl font-bold mb-4 text-webcolor text-center p-5">Continue Booking...</h1>
            <p className='text-2xl text-center'><strong>Remaining Seats:{remainingSeats}</strong></p>
            <h4 className='text-center'>Total Amount: { }</h4>
            <div className="p-5 rounded-lg card lg:w-3/4 border-2  bg-blue-50  m-auto">
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
                  <button
                    type="submit"
                    className="btn bg-webcolor text-text-light hover:text-green border-none w-1/4 m-auto"
                  // disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner text-text-light"></span>
                        <span className="text-text-light">Submitting...</span>
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
