import { useState} from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { RootState } from '../../../../app/store';
import { useFetchCarSpecsQuery } from '../../../../features/vehicles/vehicleAPI';
import { toast, Toaster } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { paymentAPI } from '../../../../features/payments/paymentAPI';
import { Link } from 'react-router-dom';
import { bookingVehicleAPI} from '../../../../features/booking/bookingAPI';
// import { useGetTicketsQuery } from '../../../../features/tickets/ticketsAPI';

// Stripe Promise initialization
const stripePromise = loadStripe('pk_test_51PbJt2DCaCRrBDN9JDhg6tno1Va2kCyCSjiEAFoaRwfSRafu2VRevSyI84JGwVrXtWRXybqZoMtmW134wvE6xJGt00m45tNU5L');

const Payment = () => {
  const user = useSelector((state: RootState) => state.user);
  const user_id = user.user?.user_id || 0; // Get user id, fallback to 0 if not available
  console.log('User ID is:', user_id);

  //get bookings data
  const { data: bookingData, isLoading: bookingLoading, error: bookingError } = bookingVehicleAPI.useGetBookingVehicleQuery(user_id
    // ,{refetchOnMountOrArgChange: true, refetchOnReconnect: true, refetchOnFocus: true,}
  );
  // console.log('Booking Data:', bookingData);

  //fetch tickets data
  // const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = useGetTicketsQuery();
  // console.log('Tickets Data:', tickets);


  // Fetch vehicles data
  const { data: vehicle, isLoading: vehicleLoading, error: vehicleError } = useFetchCarSpecsQuery();
  // console.log('Vehicle Data:', vehicle);

  const [createPayment] = paymentAPI.useCreatePaymentMutation();
  const [isPaymentLoading, setIsPaymentLoading] = useState<number | null>(null);

  const formatDate = (isoDate: string | Date): string => {
    if (!isoDate) return 'Invalid date';
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return 'Invalid date';
    return format(date, 'MM/dd/yyyy');
  };
  

  // Function to get tickets by user_id
  // const getTicketByUserId = (user_id: number) => {
  //   if (tickets) {
  //     console.log('Tickets Data:', tickets);
  //     const ticket = tickets.find((t: { ticket_id: number; }) => t.ticket_id === user_id);
  //     if (ticket) {
  //       return ticket;
  //     } else {
  //       console.log(`Ticket with user ID ${user_id} not found`);
  //     }
  //   }
  //   return 'Ticket ID not found';
  // };

  // Function to get bookings by user_id
  const getBookingByUserId = (user_id: number) => {
    if (bookingData) {
      console.log('Booking Data:', bookingData);
      const booking = bookingData.find((b: { booking_id: number; }) => b.booking_id === user_id);
      if (booking) {
        return booking;
      } else {
        console.log(`Booking with user ID ${user_id} not found`);
      }
    }
    return 'Booking ID not found';
  };

  // Function to get vehicle details by registration number
  const getVehicleDetails = (registration_number: string) => {
    if (vehicle) {
      const vehicleDetails = vehicle.find((v: { registration_number: string; }) => v.registration_number === registration_number);
      if (vehicleDetails) {
        return vehicleDetails;
      } else {
        console.log(`Vehicle with ID ${registration_number} not found`);
      }
    }
    return 'Vehicle not found';
  };

  const handleMakePayment = async (booking_id: number, total_price: string) => {
    console.log('Initiating payment with booking_id:', booking_id, 'and amount:', total_price);
    const amountNumber = parseFloat(total_price);
    if (isNaN(amountNumber)) {
      toast.error('Invalid amount');
      console.error('Invalid amount:', total_price);
      return;
    }
    const payload = { booking_id, total_price: amountNumber, user_id };
    console.log('Payment payload:', payload);
    setIsPaymentLoading(booking_id);

    //create payment session
    try {
      const paymentResponse = await createPayment(payload).unwrap();
      console.log('Payment response:', paymentResponse);
      toast.success('Payment initiated successfully');

      const stripe = await stripePromise;
      //Redirect to stripe checkout url
      if (paymentResponse.url && stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: paymentResponse.sessionId,
        });
        if (error) {
          console.error('Error redirecting to checkout:', error);
          toast.error('Error redirecting to checkout');
        }
      }

    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Error initiating payment');
    } finally {
      setIsPaymentLoading(null);
    }
  };
  
  // Render loading or error states
  if (vehicleLoading) {
    return <div>Loading data...</div>;
  }

  if (vehicleError) {
    return <div>Error loading vehicle data</div>;
  }

  if (!bookingData || !user_id ||!bookingData.data || bookingData.length === 0) {
    return (
      <div className="flex flex-col">
        <h2 className="text-center text-xl p-2 rounded-t-md text-webcolor font-bold border-b-2 border-slate-500">
          No Payment History
        </h2>
        <button>
          <Link to="/dashboard/booking_form" className="btn bg-webcolor text-text-light hover:text-black">
            Book a Seat
          </Link>
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster
        toastOptions={{
          classNames: {
            error: 'bg-red-400',
            success: 'text-green-400',
            warning: 'text-yellow-400',
            info: 'bg-blue-400',
          },
        }}
      />
      <div className="card shadow-xl mx-auto w-full rounded-md mb-10 border-2 bg-blue-50 min-h-screen">
        <h2 className="text-center text-xl p-2 rounded-t-md text-black font-bold border-b-2 border-slate-500">
          My Payment History
        </h2>

        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-blue-700">
              <th className="px-4 py-2 text-left text-text-light">User ID</th>
              {/* <th className="px-4 py-2 text-left text-text-light">Ticket ID</th> */}
                <th className="px-4 py-2 text-left text-text-light">Booking ID</th>
                <th className="px-4 py-2 text-left text-text-light">Vehicle ID</th>
                <th className="px-4 py-2 text-left text-text-light">Booking Date</th>
                <th className="px-4 py-2 text-left text-text-light">Total Amount</th>
                <th className="px-4 py-2 text-left text-text-light">Booking Status</th>
                <th className="px-4 py-2 text-left text-text-light">Payment Status</th>
                <th className="px-4 py-2 text-left text-text-light">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookingData.map((booking:BookingData) => (
                <tr key={booking.booking_id} className="border-b border-slate-950">
                  <td className='px-4 py-2'>{booking.user_id}</td>
                  {/* <td className='px-4 py-2'>{getTicketByUserId(booking.user_id)}</td> */}
                  <td className="px-4 py-2">{booking.booking_id}</td>
                  <td className="px-4 py-2">{booking.vehicle_id}</td>
                  <td className="px-4 py-2">{formatDate(booking.payment_date)}</td>
                  <td className="px-4 py-2">{booking.total_price}</td>
                  <td className="px-4 py-2">{booking.booking_status}</td>
                  <td className="px-4 py-2">
                    {booking.payment_status === 'completed' ? 'Paid' : 'Not Paid'}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="btn bg-blue-950 text-text-light hover:text-black border-none"
                      onClick={() => handleMakePayment(booking.booking_id, booking.price)}
                      disabled={isPaymentLoading === booking.booking_id || ( booking.payment_status === 'Paid')}
                    >
                      {isPaymentLoading === booking.booking_id ? (
                        <div className="flex items-center">
                          <span className="loading loading-spinner text-text-light"></span>
                          <span> Processing...</span>
                        </div>
                      ) : (
                        'Make Payment'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Payment;