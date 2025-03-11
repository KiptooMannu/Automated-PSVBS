import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

interface MpesaPaymentModalProps {
  bookingId: number;
  amount: number;
  onClose: () => void;
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
}

const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  bookingId,
  amount,
  onClose,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length !== 12 || !phoneNumber.startsWith("254")) {
      toast.error("Please enter a valid phone number starting with 254.");
      return;
    }

    setIsSubmitting(true);
    toast.info("Initiating payment...");

    try {
      // Call the STK Push endpoint
      const response = await fetch("https://backenc-automated-psvbs-deployment.onrender.com/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          amount,
          booking_id: bookingId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Payment initiated successfully. Please complete the payment on your phone.");

        // Extract CheckoutRequestID from the STK Push response
        const checkoutRequestID = data.data.CheckoutRequestID;

        if (!checkoutRequestID) {
          toast.error("Failed to retrieve CheckoutRequestID.");
          onPaymentFailure();
          return;
        }

        // Start polling immediately for payment status
        const pollPaymentStatus = async () => {
          try {
            const statusResponse = await fetch(
              `https://backenc-automated-psvbs-deployment.onrender.com/payment-status?checkout_request_id=${checkoutRequestID}`
            );
            const statusData = await statusResponse.json();

            if (statusData.payment_status === "completed") {
              toast.success("Payment confirmed successfully!");
              onPaymentSuccess(); // Trigger success handler
              navigate("/my_bookings"); // Redirect to mybookings.tsx
            } else if (statusData.payment_status === "failed") {
              toast.error("Payment failed. Please try again.");
              onPaymentFailure(); // Trigger failure handler
              navigate("/my_bookings"); // Redirect to mybookings.tsx
            } else {
              // Continue polling if payment is still pending
              setTimeout(pollPaymentStatus, 3000); // Poll every 3 seconds
            }
          } catch (error) {
            console.error("Error polling payment status:", error);
            toast.error("An error occurred while confirming payment.");
            onPaymentFailure(); // Trigger failure handler
            navigate("/my_bookings"); // Redirect to mybookings.tsx
          }
        };

        // Start polling
        pollPaymentStatus();
      } else {
        toast.error(data.error || "Failed to initiate payment. Please try again.");
        onPaymentFailure();
        navigate("/my_bookings"); // Redirect to mybookings.tsx
      }
    } catch (error) {
      toast.error("An error occurred while initiating payment.");
      onPaymentFailure(); // Trigger failure handler
      navigate("/my_bookings"); // Redirect to mybookings.tsx
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Configure Toaster to display messages at the top-right */}
      <Toaster position="top-right" richColors />

      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
        <h2 className="text-xl font-bold mb-4">M-Pesa Payment</h2>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block mb-1">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border rounded w-full py-2 px-3"
            placeholder="254XXXXXXXXX"
          />
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">Amount: KSh {amount.toFixed(2)}</p>
          <p className="text-lg font-semibold">Booking ID: {bookingId}</p>
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-800">Cancel</button>
          <button
            type="button"
            onClick={handlePayment}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Pay via M-Pesa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MpesaPaymentModal;