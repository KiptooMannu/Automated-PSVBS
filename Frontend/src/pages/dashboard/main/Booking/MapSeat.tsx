import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';
import { Vehicle } from '../../../../features/vehicles/vehicleAPI';
import { useCreateBookingVehicleMutation } from '../../../../features/booking/bookingAPI';

interface MapSeatModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

interface BookingData {
  booking_date: string;
  departure_time: string;
  departure_date: string;
}

const schema = yup.object().shape({
  booking_date: yup
    .string()
    .required("Booking date is required")
    .test("is-valid-date", "Booking date cannot be in the past", (value) => {
      return value ? new Date(value) >= new Date() : false;
    }),

  departure_time: yup.string().required("Departure time is required"),

  departure_date: yup
    .string()
    .required("Departure date is required")
    .test("is-valid-date", "Departure date is invalid", (value) => {
      return value ? !isNaN(Date.parse(value)) : false;
    }),
});

const MapSeatModal: React.FC<MapSeatModalProps> = ({ vehicle, onClose }) => {
  const user = useSelector((state: RootState) => state.user);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [createBooking] = useCreateBookingVehicleMutation();

  const externalData = {
    user_id: user.user?.user_id,
    vehicle_id: vehicle.registration_number,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingData>({
    resolver: yupResolver(schema),
  });


  // Fetch booked seats when component loads
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await fetch(`/api/booked-seats?vehicle_id=${vehicle.registration_number}`);
        const data = await response.json();
        setBookedSeats(data.booked_seats || []);
      } catch (error) {
        console.error("Error fetching booked seats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookedSeats();
  }, [vehicle.registration_number]);


  const onSubmit: SubmitHandler<BookingData> = async (formData) => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat.');
      return;
    }
  
    // Helper function to parse date and prevent errors
    const parseDate = (date: string | Date): string | null => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        console.error(`Invalid date: ${date}`);
        return null;
      }
      return parsedDate.toISOString();
    };
  
    const bookingDateString = parseDate(formData.booking_date);
    const departureDateString = parseDate(formData.departure_date);
  
    if (!bookingDateString || !departureDateString) {
      toast.error('Invalid date format. Please enter valid dates.');
      return;
    }
  // Ensure accurate total price calculation
const total_price = parseFloat((selectedSeats.length * vehicle.cost).toFixed(2));

const dataToSubmit = {
  ...externalData,
  ...formData,
  booking_date: bookingDateString,
  departure_date: departureDateString,
  seat_numbers: selectedSeats, // Sending seat numbers directly
  departure: vehicle.departure,
  destination: vehicle.destination,
  price: vehicle.cost, // Price for one seat
  total_price: total_price, // ✅ Use declared variable
};

  
    console.log("Data to submit:", dataToSubmit);
  
    try {
      setIsSubmitting(true);
      await createBooking(dataToSubmit).unwrap();
      toast.success(`Booking created successfully for seat(s): ${selectedSeats.join(', ')}`);
      setTimeout(() => navigate('/dashboard/payments'), 1000);
    } catch (err) {
      toast.error('Error creating booking');
      console.error('Error creating booking:', err);
      // console.log(err?.data);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const calculateRemainingSeats = () => {
    const bookedSeats = vehicle.booked_Seats ?? 0;
    return vehicle.capacity - bookedSeats > 0 ? vehicle.capacity - bookedSeats : 0;
  };

  const remainingSeats = calculateRemainingSeats();
  const totalAmount = selectedSeats.length * vehicle.cost;  // Price for one seat * number of selected seats

  const seats = Array.from({ length: vehicle.capacity }, (_, i) => `S${i + 1}`);
  const seatRows = [];
  for (let i = 0; i < seats.length; i += 4) {
    seatRows.push(seats.slice(i, i + 4));
  }

  const handleSeatClick = (seat: string) => {
    if (bookedSeats.includes(seat)) return; // ✅ Prevents clicking booked seats
    setSelectedSeats((prevSelected) => 
      prevSelected.includes(seat)
        ? prevSelected.filter((selected) => selected !== seat)
        : [...prevSelected, seat]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 max-h-screen overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Select Seats</h2>
  
        {isLoading ? (
          <p className="text-center text-gray-600">Loading seats...</p> 
        ) : (
          <>
            {/* Seat Layout */}
            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-md">
              {Array.from({ length: vehicle.capacity }, (_, i) => `S${i + 1}`).map((seat) => (
                <button
                  key={seat}
                  className={`p-3 w-12 h-12 rounded-lg border font-semibold transition ${
                    bookedSeats.includes(seat) ? 'bg-red-500 text-white' :
                    selectedSeats.includes(seat) ? 'bg-green-500 text-white' : 
                    'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={bookedSeats.includes(seat)}
                >
                  {seat}
                </button>
              ))}
            </div>
  
            {/* Selected Seats Info */}
            <div className="mt-5 text-center">
              <h2 className="text-lg font-semibold">Selected Seats</h2>
              <p className="text-md">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
              </p>
              <p className="text-md font-semibold">Total Seats: {selectedSeats.length}</p>
              <p className="text-lg font-bold">Total Cost: ${totalAmount}</p>
            </div>
  
            {/* Booking Form */}
            {vehicle.is_active ? (
              <>
                <h1 className="text-xl font-bold text-center mt-6">Continue Booking</h1>
                <p className="text-lg text-center">
                  <strong>Remaining Seats: {remainingSeats}</strong>
                </p>
  
                <div className="p-5 bg-gray-50 rounded-lg shadow-md mt-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="font-semibold">Booking Date</label>
                        <input type="date" className="w-full p-2 border rounded" {...register('booking_date')} />
                        <p className="text-red-500 text-sm">{errors?.booking_date?.message}</p>
                      </div>
                      <div className="flex-1">
                        <label className="font-semibold">Departure Date</label>
                        <input type="date" className="w-full p-2 border rounded" {...register('departure_date')} />
                        <p className="text-red-500 text-sm">{errors?.departure_date?.message}</p>
                      </div>
                      <div className="flex-1">
                        <label className="font-semibold">Departure Time</label>
                        <input type="time" className="w-full p-2 border rounded" {...register('departure_time')} />
                        <p className="text-red-500 text-sm">{errors?.departure_time?.message}</p>
                      </div>
                    </div>
  
                    <div className="flex justify-between mt-6">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition w-full"
                        disabled={isSubmitting || selectedSeats.length === 0}
                      >
                        {isSubmitting ? 'Submitting...' : 'Create Booking'}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500 transition w-full"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center p-5">
                <p className="text-xl">Vehicle is not available for booking</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500 transition"
                >
                  Close
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default MapSeatModal;