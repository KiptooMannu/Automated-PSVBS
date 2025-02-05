import { useState} from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { RootState } from '../../../../app/store';
import { toast, Toaster } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { paymentAPI } from '../../../../features/payments/paymentAPI';
import { Link } from 'react-router-dom';
import { bookingVehicleAPI} from '../../../../features/booking/bookingAPI';
import { Tbooking } from '../../../../features/booking/bookingAPI';


// Stripe Promise initialization
const stripePromise = loadStripe('pk_test_51PbJt2DCaCRrBDN9JDhg6tno1Va2kCyCSjiEAFoaRwfSRafu2VRevSyI84JGwVrXtWRXybqZoMtmW134wvE6xJGt00m45tNU5L');

const Payment = () => {
  const user = useSelector((state: RootState) => state.user);
  const user_id = user.user?.user_id || 0; // Get user id, fallback to 0 if not available
  console.log('User ID is:', user_id);

  const [confirmBooking] = bookingVehicleAPI.useConfirmBookingMutation();
  const { data: bookingData, refetch } = bookingVehicleAPI.useGetUserBookingQuery(user_id); 
  const [createPayment] = paymentAPI.useCreatePaymentMutation();
  const [isPaymentLoading, setIsPaymentLoading] = useState<number | null>(null);

  const formatDate = (isoDate: string | Date): string => {
    if (!isoDate) return 'Invalid date';
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return 'Invalid date';
    return format(date, 'MM/dd/yyyy');
  };
  
  const sortedBookingData = bookingData
  ?.slice()
  .sort((a, b) => {
    const aPaid = a.payments?.some(p => p.payment_status === "completed");
    const bPaid = b.payments?.some(p => p.payment_status === "completed");
    
    // Show unpaid bookings first
    if (aPaid && !bPaid) return 1;
    if (!aPaid && bPaid) return -1;
    
    // If both are unpaid or both are paid, sort by latest booking date
    return new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime();
  });



  const recentUnpaidBooking = bookingData
  ?.slice()
  .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()) // Sort by newest first
  .find(booking => !booking.payments?.some(p => p.payment_status === "completed")); // Find first unpaid booking


  const handleMakePayment = async (booking_id: number, total_price: string) => {
    console.log('Processing booking confirmation for booking_id:', booking_id);
  
    const amountNumber = parseFloat(total_price);
    if (isNaN(amountNumber)) {
      toast.error('Invalid amount');
      console.error('Invalid amount:', total_price);
      return;
    }
  
    setIsPaymentLoading(booking_id);
  
    try {
      // ✅ Step 1: Confirm Booking Before Proceeding
      const confirmResponse = await confirmBooking({ booking_id }).unwrap();
  
      if (!confirmResponse.success) {
        toast.error('Booking confirmation failed. Please try again.');
        return;
      }
  
      toast.success('✅ Booking confirmed! Proceeding to payment...');
  
      // ✅ Step 2: Proceed to Payment After Confirmation
      const payload = { booking_id, total_price: amountNumber, user_id };
      console.log('Payment payload:', payload);
  
      const paymentResponse = await createPayment(payload).unwrap();
      console.log('Payment response:', paymentResponse);
      toast.success('💳 Payment session created successfully. Redirecting to Stripe...');

      const stripe = await stripePromise;
      if (paymentResponse.url && stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: paymentResponse.sessionId,
        });
  
        if (error) {
          console.error('Error redirecting to checkout:', error);
          toast.error('Error redirecting to checkout');
        }
      }
  
      // ✅ Step 3: Refresh Payment Status After Completion
      setTimeout(() => {
        if (refetch) {
          refetch();
        }
      }, 3000);
    } catch (error) {
      console.error('Error in payment process:', error);
      toast.error('❌ Payment process failed. Please try again.');
    } finally {
      setIsPaymentLoading(null);
    }
  };

  

  if (!bookingData || bookingData.length === 0) {
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
        <table className="table-auto w-full border-collapse">
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


   
 {sortedBookingData?.slice()
 .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()) // Sort newest first
    .map((booking: Tbooking) => (
<tr key={booking.booking_id} 
    className={`border-b border-slate-950 ${booking === recentUnpaidBooking ? 'bg-yellow-200' : ''} relative h-25`}>

        <td className="px-4 py-2">{booking.user_id}</td>
        <td className="px-4 py-2">{booking.booking_id}</td>
        <td className="px-4 py-2">{booking.vehicle_id}</td>
        <td className="px-4 py-2">{formatDate(booking.booking_date)}</td>
        <td className="px-4 py-2">{booking.total_price}</td>
        <td className={`px-4 py-2 text-center font-bold rounded-md cursor-pointer ${
  booking.booking_status === "pending"
    ? "text-orange-700 bg-orange-200 border border-orange-500 shadow-sm"
    : booking.booking_status === "confirmed"
    ? "text-blue-700 bg-blue-200 border border-blue-500 shadow-sm"
    : booking.booking_status === "completed"
    ? "text-green-700 bg-green-200 border border-green-500 shadow-sm"
    : "text-gray-700 bg-gray-200 border border-gray-500 shadow-sm"
}`}>
  {booking.booking_status === "pending"
    ? "🕒 Pending"
    : booking.booking_status === "confirmed"
    ? "📌 Confirmed"
    : booking.booking_status === "completed"
    ? "✅ Completed"
    : "❌ Cancelled"}


<span className="absolute hidden group-hover:flex bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-lg 
                left-1/2 transform -translate-x-1/2 bottom-full mb-2 whitespace-nowrap min-w-[280px] text-center z-50">
  {booking.payments?.some(p => p.payment_status === "completed")
    ? "✅ Payment confirmed. Thank you!"
    : booking.payments?.some(p => p.payment_status === "pending")
    ? "⏳ Payment is in process, please wait."
    : booking.payments?.some(p => p.payment_status === "failed")
    ? "❌ Payment failed. Please try again."
    : "💳 Your payment has been refunded."}
</span>

</td>

    
  
        <td className={`px-4 py-2 text-center font-bold rounded-md cursor-pointer relative group ${
  booking.payments?.some(p => p.payment_status === "completed")
    ? "text-green-700 bg-green-200 border border-green-500 shadow-sm"
    : booking.payments?.some(p => p.payment_status === "pending")
    ? "text-yellow-700 bg-yellow-200 border border-yellow-500 shadow-sm"
    : booking.payments?.some(p => p.payment_status === "failed")
    ? "text-red-700 bg-red-200 border border-red-500 shadow-md animate-blink"
    : "text-blue-700 bg-blue-200 border border-blue-500 shadow-sm"
}`}>
  {booking.payments?.some(p => p.payment_status === "completed")
    ? "✅ Payment Completed"
    : booking.payments?.some(p => p.payment_status === "pending")
    ? "⏳ Payment Pending"
    : booking.payments?.some(p => p.payment_status === "failed")
    ? "❌ Payment Failed"
    : "💳 Refunded"}
</td>


        <td className="px-4 py-2">
        <button
  className={`btn text-white border-none px-4 py-2 rounded-md
    ${booking.payments?.some(p => p.payment_status === "completed")
      ? "bg-gray-400 cursor-not-allowed"
      : booking === recentUnpaidBooking
      ? "animate-pulse bg-red-600"
      : "bg-blue-950 hover:bg-blue-800 hover:text-white"}`}
  onClick={() => handleMakePayment(booking.booking_id, booking.total_price.toString())}
  disabled={isPaymentLoading === booking.booking_id || booking.payments?.some(p => p.payment_status === "completed")}
>
  {isPaymentLoading === booking.booking_id ? "⏳ Processing..." : "💳 Make Payment"}
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