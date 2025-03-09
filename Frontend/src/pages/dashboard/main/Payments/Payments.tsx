// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { format } from 'date-fns';
// import { RootState } from '../../../../app/store';
// import { toast, Toaster } from 'sonner';
// import { Link } from 'react-router-dom';
// import { bookingVehicleAPI } from '../../../../features/booking/bookingAPI';
// import { Tbooking } from '../../../../features/booking/bookingAPI';
// import { paymentAPI } from '../../../../features/payments/paymentAPI';

// const Payment = () => {
//   const user = useSelector((state: RootState) => state.user);
//   const user_id = user.user?.user_id || 0;
//   console.log('User ID is:', user_id);

//   const { data: bookingData, refetch } = bookingVehicleAPI.useGetUserBookingQuery(user_id);
//   const [createPayment] = paymentAPI.useCreatePaymentMutation();
//   const [isPaymentLoading, setIsPaymentLoading] = useState<number | null>(null);
//   const [showMpesaForm, setShowMpesaForm] = useState<boolean>(false);
//   const [selectedBooking, setSelectedBooking] = useState<{ booking_id: number; total_price: string } | null>(null);
//   const [paymentStatus, setPaymentStatus] = useState<{ success: boolean; message: string } | null>(null);

//   const formatDate = (isoDate: string | Date): string => {
//     if (!isoDate) return 'Invalid date';
//     const date = new Date(isoDate);
//     if (isNaN(date.getTime())) return 'Invalid date';
//     return format(date, 'MM/dd/yyyy');
//   };

//   const sortedBookingData = bookingData
//     ?.slice()
//     .sort((a, b) => {
//       const aPaid = a.payments?.some(p => p.payment_status === "completed");
//       const bPaid = b.payments?.some(p => p.payment_status === "completed");

//       // Show unpaid bookings first
//       if (aPaid && !bPaid) return 1;
//       if (!aPaid && bPaid) return -1;

//       // If both are unpaid or both are paid, sort by latest booking date
//       return new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime();
//     });

//   const recentUnpaidBooking = bookingData
//     ?.slice()
//     .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())
//     .find(booking => !booking.payments?.some(p => p.payment_status === "completed"));

//   const handleMakePayment = (booking_id: number, total_price: string) => {
//     setSelectedBooking({ booking_id, total_price });
//     setShowMpesaForm(true);
//   };



//   const handleMpesaPayment = async (phone_number: string) => {
//     if (!selectedBooking) return;
  
//     const { booking_id, total_price } = selectedBooking;
//     const amountNumber = parseFloat(total_price);
  
//     if (isNaN(amountNumber)) {
//       toast.error("Invalid amount");
//       return;
//     }
  
//     setIsPaymentLoading(booking_id);
  
//     try {
//       console.log("🚀 Initiating M-Pesa STK Push...");
  
//       // ✅ Initiate M-Pesa STK Push
//       const response = await fetch(
//         "https://backenc-automated-psvbs-deployment.onrender.com/mpesa/stkpush",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             phone_number,
//             amount: amountNumber,
//             booking_id,
//             CallBackURL: "https://backenc-automated-psvbs-deployment.onrender.com/mpesa/callback",
//             AccountReference: `Booking_${booking_id}`,
//             TransactionDesc: "Payment for booking",
//           }),
//         }
//       );
  
//       if (!response.ok) {
//         const errorResponse = await response.json();
//         console.error("❌ STK Push Request Failed:", errorResponse);
  
//         // Handle specific error code for ongoing transaction
//         if (errorResponse.errorCode === "500.001.1001") {
//           throw new Error(
//             "A transaction is already in process for this phone number. Please complete the ongoing transaction or wait for it to timeout before trying again."
//           );
//         }
  
//         throw new Error(errorResponse.message || "Failed to initiate M-Pesa payment");
//       }
  
//       // ✅ Parse STK Response
//       let stkResponse;
//       try {
//         stkResponse = await response.json();
//       } catch (jsonError) {
//         console.error("❌ Error parsing JSON response:", jsonError);
//         toast.error("❌ Invalid response from M-Pesa. Contact support.");
//         return;
//       }
  
//       // ✅ Log the full response for debugging
//       console.log("🔍 Full STK Response:", stkResponse);
  
//       // ✅ Ensure we're accessing the correct structure
//       const stkData = stkResponse?.data;
//       if (!stkData || !stkData.ResponseCode) {
//         console.error("❌ Invalid STK Response format:", stkResponse);
//         toast.error("❌ Unexpected response from M-Pesa. Contact support.");
//         return;
//       }
  
//       if (stkData.ResponseCode === "0") {
//         console.log("✅ M-Pesa STK Push successful:", stkData);
//         toast.success("✅ M-Pesa payment initiated. Enter your PIN.");
  
//         // ✅ Save payment record
//         try {
//           const paymentPayload = {
//             booking_id,
//             amount: amountNumber.toString(), // Ensure amount is a string if the server expects it
//             phone_number, // Include phone_number in the payload
//             payment_method: "M-Pesa",
//             payment_status: "pending",
//             transaction_reference: stkData.CheckoutRequestID,
//           };
  
//           console.log("🔍 Payment Payload:", paymentPayload);
  
//           const paymentResponse = await createPayment(paymentPayload).unwrap();
//           console.log("✅ Payment record created:", paymentResponse);
//         } catch (error) {
//           console.error("❌ Failed to create payment record:", error);
  
//           // Log the full error response from the server
//           if (error && typeof error === "object" && "data" in error) {
//             const serverError = error as { data: { error: string; details?: any } };
//             console.error("🔍 Server Error Response:", serverError.data);
//             toast.error(`❌ Payment record creation failed: ${serverError.data?.error || "Unknown error"}`);
//           } else {
//             toast.error("❌ Payment record creation failed: Unknown error");
//           }
//           return;
//         }
  
//         // ✅ Start polling payment status
//         checkPaymentStatus(stkData.CheckoutRequestID, booking_id.toString());
//       } else {
//         console.error("❌ STK Push Failed:", stkData.ResponseDescription || "Unknown error");
//         toast.error(`❌ Payment failed: ${stkData.ResponseDescription || "Unknown error"}`);
//         return;
//       }
//     } catch (error: any) {
//       console.error("❌ Error initiating M-Pesa payment:", error);
//       setPaymentStatus({
//         success: false,
//         message: error.message || "❌ Failed to initiate M-Pesa payment. Please try again.",
//       });
//       toast.error(error.message || "❌ Failed to initiate M-Pesa payment. Please try again.");
//     } finally {
//       setIsPaymentLoading(null);
//       setShowMpesaForm(false);
//     }
//   };






  
  
//   // ✅ Function to check payment status
//   const checkPaymentStatus = async (checkoutRequestID: string, booking_id: string) => {
//     let paymentStatusChecked = 0;
//     const maxRetries = 6; // 10s interval → 60s timeout
  
//     const pollStatus = async () => {
//       if (paymentStatusChecked >= maxRetries) {
//         console.log("❌ Payment timeout reached.");
//         setPaymentStatus({ success: false, message: "❌ Payment timed out. Please try again." });
//         toast.error("❌ Payment timed out. Please try again.");
//         return;
//       }
  
//       try {
//         const updatedBooking = await bookingVehicleAPI.useGetUserBookingQuery(user_id).refetch();
//         const booking = updatedBooking.data?.find((b) => b.booking_id === Number(booking_id));
  
//         if (booking) {
//           const payment = booking.payments?.find(
//             (p) => p.transaction_reference === checkoutRequestID
//           );
  
//           if (payment) {
//             switch (payment.payment_status) {
//               case "completed":
//                 console.log("✅ Payment successful.");
//                 setPaymentStatus({ success: true, message: "✅ Payment completed successfully!" });
//                 toast.success("✅ Payment completed successfully!");
//                 refetch();
//                 return;
//               case "failed":
//                 console.log("❌ Payment failed. User may have canceled.");
//                 setPaymentStatus({ success: false, message: "❌ Payment failed. Please try again." });
//                 toast.error("❌ Payment failed. Please try again.");
//                 refetch();
//                 return;
//               default:
//                 console.log(`⏳ Still pending... (${paymentStatusChecked + 1}/${maxRetries})`);
//                 paymentStatusChecked++;
//                 setTimeout(pollStatus, 10000);
//                 break;
//             }
//           }
//         }
//       } catch (error) {
//         console.error("❌ Polling error:", error);
//         setTimeout(pollStatus, 10000);
//       }
//     };
  
//     pollStatus();
//   };
  

//   if (!bookingData || bookingData.length === 0) {
//     return (
//       <div className="flex flex-col">
//         <h2 className="text-center text-xl p-2 rounded-t-md text-webcolor font-bold border-b-2 border-slate-500">
//           No Payment History
//         </h2>
//         <button>
//           <Link to="/dashboard/booking_form" className="btn bg-webcolor text-text-light hover:text-black">
//             Book a Seat
//           </Link>
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Toaster
//         toastOptions={{
//           classNames: {
//             error: 'bg-red-400',
//             success: 'text-green-400',
//             warning: 'text-yellow-400',
//             info: 'bg-blue-400',
//           },
//         }}
//       />
//       {paymentStatus && (
//         <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${paymentStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//           {paymentStatus.message}
//         </div>
//       )}
//       <div className="card shadow-xl mx-auto w-full rounded-md mb-10 border-2 bg-blue-50 min-h-screen">
//         <h2 className="text-center text-xl p-2 rounded-t-md text-black font-bold border-b-2 border-slate-500">
//           My Payment History
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="table-auto w-full border-collapse">
//             <thead>
//               <tr className="bg-blue-700">
//                 <th className="px-4 py-2 text-left text-text-light">User ID</th>
//                 <th className="px-4 py-2 text-left text-text-light">Booking ID</th>
//                 <th className="px-4 py-2 text-left text-text-light">Vehicle ID</th>
//                 <th className="px-4 py-2 text-left text-text-light">Booking Date</th>
//                 <th className="px-4 py-2 text-left text-text-light">Total Amount</th>
//                 <th className="px-4 py-2 text-left text-text-light">Booking Status</th>
//                 <th className="px-4 py-2 text-left text-text-light">Payment Status</th>
//                 <th className="px-4 py-2 text-left text-text-light">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedBookingData?.map((booking: Tbooking) => (
//                 <tr
//                   key={booking.booking_id}
//                   className={`border-b border-slate-950 ${booking === recentUnpaidBooking ? 'bg-yellow-200' : ''} relative h-25`}
//                 >
//                   <td className="px-4 py-2">{booking.user_id}</td>
//                   <td className="px-4 py-2">{booking.booking_id}</td>
//                   <td className="px-4 py-2">{booking.vehicle_id}</td>
//                   <td className="px-4 py-2">{formatDate(booking.booking_date)}</td>
//                   <td className="px-4 py-2">{booking.total_price}</td>
//                   <td
//                     className={`px-4 py-2 text-center font-bold rounded-md cursor-pointer ${
//                       booking.booking_status === "pending"
//                         ? "text-orange-700 bg-orange-200 border border-orange-500 shadow-sm"
//                         : booking.booking_status === "confirmed"
//                         ? "text-blue-700 bg-blue-200 border border-blue-500 shadow-sm"
//                         : booking.booking_status === "completed"
//                         ? "text-green-700 bg-green-200 border border-green-500 shadow-sm"
//                         : "text-gray-700 bg-gray-200 border border-gray-500 shadow-sm"
//                     }`}
//                   >
//                     {booking.booking_status === "pending"
//                       ? "🕒 Pending"
//                       : booking.booking_status === "confirmed"
//                       ? "📌 Confirmed"
//                       : booking.booking_status === "completed"
//                       ? "✅ Completed"
//                       : "❌ Cancelled"}
//                   </td>
//                   <td
//   className={`px-4 py-2 text-center font-bold rounded-md cursor-pointer relative group ${
//     booking.payments?.some(p => p.payment_status === "completed")
//       ? "text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-sm"
//       : booking.payments?.some(p => p.payment_status === "pending") || !booking.payments?.length
//       ? "text-amber-700 bg-amber-50 border border-amber-200 shadow-sm"
//       : booking.payments?.some(p => p.payment_status === "failed")
//       ? "text-rose-700 bg-rose-50 border border-rose-200 shadow-sm"
//       : "text-slate-700 bg-slate-50 border border-slate-200 shadow-sm"
//   }`}
// >
//   {booking.payments?.some(p => p.payment_status === "completed")
//     ? "✅ Payment Completed"
//     : booking.payments?.some(p => p.payment_status === "pending") || !booking.payments?.length
//     ? "⏳ Payment Pending"
//     : booking.payments?.some(p => p.payment_status === "failed")
//     ? "❌ Payment Failed"
//     : "💳 No Payment Data"}
// </td>

//                   <td className="px-4 py-2">
//                     <button
//                       className={`btn text-white border-none px-4 py-2 rounded-md ${
//                         booking.payments?.some(p => p.payment_status === "completed")
//                           ? "bg-gray-400 cursor-not-allowed"
//                           : booking === recentUnpaidBooking
//                           ? "animate-pulse bg-red-600"
//                           : "bg-blue-950 hover:bg-blue-800 hover:text-white"
//                       }`}
//                       onClick={() => handleMakePayment(booking.booking_id, booking.total_price.toString())}
//                       disabled={isPaymentLoading === booking.booking_id || booking.payments?.some(p => p.payment_status === "completed")}
//                     >
//                       {isPaymentLoading === booking.booking_id ? "⏳ Processing..." : "💳 Make Payment"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* M-Pesa Payment Form */}
//         {showMpesaForm && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3">
//       {/* Text-Based M-Pesa Logo */}
//       <div className="flex justify-center mb-4">
//         <span className="text-3xl font-bold text-green-600">M-PESA</span>
//       </div>
//       <h2 className="text-xl font-bold mb-4 text-center">M-Pesa Payment</h2>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           const phone_number = e.currentTarget.phone_number.value;
//           handleMpesaPayment(phone_number);
//         }}
//       >
//         <div className="mb-4">
//           <label htmlFor="phone_number" className="block mb-1">Phone Number</label>
//           <input
//             type="text"
//             id="phone_number"
//             name="phone_number"
//             placeholder="254700000000"
//             className="border rounded w-full py-2 px-3"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="amount" className="block mb-1">Amount</label>
//           <input
//             type="text"
//             id="amount"
//             name="amount"
//             value={selectedBooking?.total_price || ''}
//             readOnly
//             className="border rounded w-full py-2 px-3 bg-gray-100"
//           />
//         </div>
//         <div className="flex justify-between">
//           <button type="button" onClick={() => setShowMpesaForm(false)} className="text-gray-600 hover:text-gray-800">Cancel</button>
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//             {isPaymentLoading ? 'Processing...' : 'Pay with M-Pesa'}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}


//       </div>
//     </>
//   );
// };

// export default Payment;