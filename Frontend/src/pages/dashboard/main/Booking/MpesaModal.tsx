import { useState } from 'react';
import { Toaster, toast } from 'sonner';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length !== 12 || !phoneNumber.startsWith('254')) {
      toast.error('Please enter a valid phone number starting with 254.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the STK Push endpoint
      const response = await fetch('/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          amount,
          booking_id: bookingId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Payment initiated successfully. Please complete the payment on your phone.');
        onPaymentSuccess();
      } else {
        toast.error(data.error || 'Failed to initiate payment. Please try again.');
        onPaymentFailure();
      }
    } catch (error) {
      toast.error('An error occurred while initiating payment.');
      onPaymentFailure(); // Trigger failure handler
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster />
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
            className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Pay via M-Pesa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MpesaPaymentModal;