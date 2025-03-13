import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();
  const pollTimerRef = useRef<number | null>(null);
  const maxPollAttempts = 40; // Poll for a maximum of 2 minutes (40 x 3 seconds)
  const [pollAttempts, setPollAttempts] = useState(0);

  // Clear polling on component unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length !== 12 || !phoneNumber.startsWith("254")) {
      toast.error("Please enter a valid phone number starting with 254.");
      return;
    }

    setIsSubmitting(true);
    setIsPolling(false);
    setPollAttempts(0);
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

      if (response.ok && data.data && data.data.CheckoutRequestID) {
        toast.success("Payment initiated successfully. Please complete the payment on your phone.");
        const checkoutRequestID = data.data.CheckoutRequestID;
        setIsPolling(true);

        // Start polling for payment status
        pollPaymentStatus(checkoutRequestID);
      } else {
        toast.error(data.error || "Failed to initiate payment. Please try again.");
        onPaymentFailure();
        navigate("/my_bookings");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("An error occurred while initiating payment.");
      onPaymentFailure();
      navigate("/my_bookings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestID: string, retries = 3) => {
    try {
      // Clear any existing timer
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
  
      // Check if we've exceeded maximum poll attempts
      if (pollAttempts >= maxPollAttempts) {
        toast.error("Payment confirmation timed out. Please check your M-Pesa app for status.");
        setIsPolling(false);
        onPaymentFailure();
        navigate("/dashboard/my_bookings");
        return;
      }
  
      const statusResponse = await fetch(
        `https://backenc-automated-psvbs-deployment.onrender.com/payment-status?checkout_request_id=${checkoutRequestID}`
      );
  
      if (!statusResponse.ok) {
        // Handle HTTP error
        const errorData = await statusResponse.json();
        console.error("Status check error:", errorData);
  
        // Retry on network errors
        if (retries > 0) {
          setPollAttempts(prev => prev + 1);
          pollTimerRef.current = window.setTimeout(() => pollPaymentStatus(checkoutRequestID, retries - 1), 3000);
          return;
        }
  
        // If we get a 404, the payment might have been rolled back
        if (statusResponse.status === 404) {
          toast.error("Payment could not be found. It may have been cancelled.");
          setIsPolling(false);
          onPaymentFailure();
          navigate("/dashboard/my_bookings");
          return;
        }
  
        // Stop polling on other errors
        toast.error("An error occurred while checking payment status.");
        setIsPolling(false);
        onPaymentFailure();
        navigate("/dashboard/my_bookings");
        return;
      }
  
      const statusData = await statusResponse.json();
      console.log("Payment status:", statusData);
  
      if (statusData.payment_status === "completed") {
        toast.success("Payment confirmed successfully!");
        setIsPolling(false);
        onPaymentSuccess();
        navigate("/dashboard/my_bookings");
      } else if (statusData.payment_status === "failed") {
        toast.error("Payment failed. Please try again.");
        setIsPolling(false);
        onPaymentFailure();
        navigate("/dashboard/my_bookings");
      } else {
        // Continue polling for pending payments
        setPollAttempts(prev => prev + 1);
        pollTimerRef.current = window.setTimeout(() => pollPaymentStatus(checkoutRequestID), 3000);
      }
    } catch (error) {
      console.error("Error polling payment status:", error);
  
      // Retry on network errors
      if (retries > 0) {
        setPollAttempts(prev => prev + 1);
        pollTimerRef.current = window.setTimeout(() => pollPaymentStatus(checkoutRequestID, retries - 1), 3000);
        return;
      }
  
      toast.error("An error occurred while confirming payment.");
      setIsPolling(false);
      onPaymentFailure();
      navigate("/dashboard/my_bookings");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster position="top-right" richColors />

      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
        <h2 className="text-xl font-bold mb-4">M-Pesa Payment</h2>
        
        {isPolling && (
          <div className="mb-4 bg-blue-50 p-3 rounded">
            <p className="text-blue-700">
              Waiting for payment confirmation... ({pollAttempts}/{maxPollAttempts})
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Please complete the payment on your phone
            </p>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block mb-1">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border rounded w-full py-2 px-3"
            placeholder="254XXXXXXXXX"
            disabled={isPolling}
          />
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">Amount: KSh {amount.toFixed(2)}</p>
          <p className="text-lg font-semibold">Booking ID: {bookingId}</p>
        </div>
        <div className="flex justify-between">
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-800"
            disabled={isSubmitting || isPolling}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePayment}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${(isSubmitting || isPolling) ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSubmitting || isPolling}
          >
            {isSubmitting ? "Processing..." : isPolling ? "Waiting..." : "Pay via M-Pesa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MpesaPaymentModal;