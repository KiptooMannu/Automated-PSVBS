import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';
import { Vehicle } from '../../../../features/vehicles/vehicleAPI';
import { useCreateBookingVehicleMutation, useDeleteBookingVehicleMutation } from '../../../../features/booking/bookingAPI'; // Add delete mutation
import MpesaPaymentModal from './MpesaModal'; // Import the payment modal

interface MapSeatModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  refetchVehicles: () => void;
}

interface BookingData {
  booking_date: string;
  departure_date: string;
}

const schema = yup.object().shape({
  booking_date: yup
    .string()
    .required("Booking date is required")
    .test("is-valid-date", "Booking date cannot be in the past", (value) => {
      if (!value) return false;
      const bookingDate = new Date(value).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      return bookingDate >= today;
    }),
  departure_date: yup
    .string()
    .required("Departure date is required")
    .test("is-valid-date", "Departure date is invalid", (value) => {
      return value ? !isNaN(Date.parse(value)) : false;
    }),
});

const MapSeatModal: React.FC<MapSeatModalProps> = ({ vehicle, onClose, refetchVehicles }) => {
  const user = useSelector((state: RootState) => state.user);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [confirmedSeats, setConfirmedSeats] = useState<string[]>([]); // Track confirmed seats

  const navigate = useNavigate();
  const [createBooking] = useCreateBookingVehicleMutation();
  const [deleteBooking] = useDeleteBookingVehicleMutation(); // Add delete mutation

  const handleBookingSuccess = () => {
    if (refetchVehicles) {
      refetchVehicles();
    }
  };



  const externalData = {
    user_id: user.user?.user_id,
    vehicle_id: vehicle.registration_number,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingData>({
    resolver: yupResolver(schema),
    defaultValues: {
      booking_date: new Date().toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setValue("booking_date", today.toISOString().split('T')[0]);
  }, [setValue]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await fetch(`https://backenc-automated-psvbs-deployment.onrender.com/booked-seats?vehicle_id=${vehicle.registration_number}`);
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
    if (isSubmitting) return;
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat.');
      return;
    }

    const departureTime = vehicle.departure_time || "00:00";

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

    const total_price = parseFloat((selectedSeats.length * vehicle.cost).toFixed(2));

    const dataToSubmit = {
      ...externalData,
      ...formData,
      booking_date: bookingDateString,
      departure_date: departureDateString,
      departure_time: departureTime,
      seat_numbers: selectedSeats,
      departure: vehicle.departure,
      destination: vehicle.destination,
      price: vehicle.cost,
      total_price: total_price,
    };

    console.log("Data to submit:", dataToSubmit);
    try {
      setIsSubmitting(true);
      const response = await createBooking(dataToSubmit).unwrap();
      toast.success(`Booking created successfully for seat(s): ${selectedSeats.join(', ')}`);
      handleBookingSuccess();
      setBookingId(response.booking_id); // Set the booking ID from the response
      setShowPaymentModal(true); // Show the payment modal
    } catch (err) {
      toast.error('Error creating booking');
      console.error('Error creating booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  

  const handlePaymentSuccess = async () => {
    setConfirmedSeats(selectedSeats); // Mark selected seats as confirmed
    await refetchBookedSeats(); // Refetch booked seats from the backend
    toast.success('Payment successful! Redirecting to bookings...');
    setTimeout(() => navigate('/dashboard/mybookings'), 2000);
  };
  
  const refetchBookedSeats = async () => {
    try {
      const response = await fetch(`https://backenc-automated-psvbs-deployment.onrender.com/booked-seats?vehicle_id=${vehicle.registration_number}`);
      const data = await response.json();
      setBookedSeats(data.booked_seats || []);
    } catch (error) {
      console.error("Error fetching booked seats:", error);
    }
  };

  const handleSeatClick = (seat: string) => {
    if (bookedSeats.includes(seat) || confirmedSeats.includes(seat)) return; // Disable booked or confirmed seats
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((selected) => selected !== seat)
        : [...prevSelected, seat]
    );
  };


  const handlePaymentFailure = async () => {
    if (bookingId) {
      try {
        await deleteBooking(bookingId).unwrap(); // Rollback the booking
        toast.error('Payment failed. Booking has been cancelled.');
        setSelectedSeats([]); // Reset selected seats
      } catch (err) {
        toast.error('Failed to cancel booking after payment failure.');
        console.error('Error cancelling booking:', err);
      }
    }
    setShowPaymentModal(false); // Close the payment modal
  };


  const calculateRemainingSeats = () => {
    const bookedSeatsCount = bookedSeats.length;
    const selectedSeatsCount = selectedSeats.length;
    return vehicle.capacity - bookedSeatsCount - selectedSeatsCount - 1;
  };

  const remainingSeats = calculateRemainingSeats();
  const totalAmount = selectedSeats.length * vehicle.cost;

  const seats = Array.from({ length: vehicle.capacity }, (_, i) => `S${i + 1}`);
  const seatRows = [];
  for (let i = 0; i < seats.length; i += 4) {
    seatRows.push(seats.slice(i, i + 4));
  }



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Select Seats</h2>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading seats...</p>
        ) : (
          <>
            {/* 🚗 Car-Shaped Seat Layout */}
            <div className="relative flex flex-col items-center bg-gray-300 p-4 rounded-lg shadow-lg border-4 border-gray-800 max-w-xs mx-auto">
              {/* 🚖 Car Roof */}
              <div className="w-32 h-6 bg-gray-700 rounded-t-lg"></div>

              {/* 🚗 Driver's Section with Steering Wheel */}
              <div className="w-full flex justify-center mb-2 relative">
                <div className="relative flex flex-col items-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mb-1">
                    🏎️
                  </div>
                  <button
                    className="p-2 w-10 h-10 rounded-lg border bg-gray-800 text-white font-semibold flex items-center justify-center"
                    disabled
                  >
                    🚖 S1
                  </button>
                </div>
              </div>

              {/* Passenger Seats - Arranged Like a Car Interior */}
              <div className="w-full bg-gray-400 rounded-lg p-2">
                {Array.from({ length: Math.ceil((vehicle.capacity - 1) / 4) }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex justify-between w-full px-4 my-1">
                    {/* 🚗 Left Section (Window & Aisle Seats) */}
                    <div className="flex space-x-2">
                      {Array.from({ length: 2 }, (_, colIndex) => {
                        const seatIndex = rowIndex * 4 + colIndex + 1;
                        const seatNumber = `S${seatIndex + 1}`;

                        if (seatIndex >= vehicle.capacity) return null;

                        return (

                      <button
  key={seatNumber}
  className={`p-2 w-10 h-10 rounded-lg border font-semibold transition ${
    bookedSeats.includes(seatNumber) || confirmedSeats.includes(seatNumber)
      ? 'bg-red-500' // Booked or confirmed seats
      : selectedSeats.includes(seatNumber)
      ? 'bg-green-500' // Selected seats
      : 'bg-gray-200' // Available seats
  }`}
  onClick={() => handleSeatClick(seatNumber)}
  disabled={bookedSeats.includes(seatNumber) || confirmedSeats.includes(seatNumber)}
>
  {seatNumber}
</button>
                        );
                      })}
                    </div>

                    {/* 🚗 Right Section (Window & Aisle Seats) */}
                    <div className="flex space-x-2">
                      {Array.from({ length: 2 }, (_, colIndex) => {
                        const seatIndex = rowIndex * 4 + colIndex + 3;
                        const seatNumber = `S${seatIndex + 1}`;

                        if (seatIndex >= vehicle.capacity) return null;

                        return (
                          <button
                            key={seatNumber}
                            className={`p-2 w-10 h-10 rounded-lg border font-semibold transition ${
                              bookedSeats.includes(seatNumber) ? 'bg-red-500' : selectedSeats.includes(seatNumber) ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                            onClick={() => handleSeatClick(seatNumber)}
                            disabled={bookedSeats.includes(seatNumber)}
                          >
                            {seatNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
              <div className="mb-4">
                <label htmlFor="booking_date" className="block mb-1">Booking Date</label>
                <input
                  type="date"
                  id="booking_date"
                  {...register('booking_date')}
                  className={`border rounded w-full py-2 px-3 ${errors.booking_date ? 'border-red-500' : ''}`}
                />
                {errors.booking_date && <p className="text-red-500 text-sm">{errors.booking_date.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="departure_date" className="block mb-1">Departure Date</label>
                <input
                  type="date"
                  id="departure_date"
                  {...register('departure_date')}
                  className={`border rounded w-full py-2 px-3 ${errors.departure_date ? 'border-red-500' : ''}`}
                />
                {errors.departure_date && <p className="text-red-500 text-sm">{errors.departure_date.message}</p>}
              </div>

              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">Remaining Seats: <span className="text-blue-500">{remainingSeats}</span></p>
                <p className="text-lg font-semibold">Total Amount: <span className="text-blue-500">KSh {totalAmount.toFixed(2)}</span></p>
                <p className="text-lg font-semibold">Departure Time: <span className="text-blue-500">{vehicle.departure_time || "Not specified"}</span></p>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {showPaymentModal && bookingId && (
        <MpesaPaymentModal
          bookingId={bookingId}
          amount={totalAmount}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}
    </div>
  );
};

export default MapSeatModal;