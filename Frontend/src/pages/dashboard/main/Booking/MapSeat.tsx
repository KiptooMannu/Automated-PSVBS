import React, { useState } from 'react';
import { Toaster } from 'sonner';

interface MapSeatModalProps {
  onClose: () => void;
}

const MapSeatModal: React.FC<MapSeatModalProps> = ({ onClose }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seats = [
    ['A1', 'A2', 'A3', 'A4', 'A5'],
    ['B1', 'B2', 'B3', 'B4', 'B5'],
    ['C1', 'C2', 'C3', 'C4', 'C5'],
    ['D1', 'D2', 'D3', 'D4', 'D5'],
    ['E1', 'E2', 'E3', 'E4', 'E5'],
  ];

  const handleSeatClick = (seat: string) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((selected) => selected !== seat)
        : [...prevSelected, seat]
    );
  };

  const handleSubmit = async () => {
    setIsBooking(true);
    try {
      // Simulate API call
      // await bookingVehicleAPI(booking.id, { seats: selectedSeats });
      if (onClose) onClose();
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-3/4 max-h-screen overflow-auto ">
        <h2 className="text-xl font-bold mb-4">Select Seats</h2>

        {/* Seat Grid */}
        <div className="grid grid-cols-5 gap-4">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-4">
              {row.map((seat) => (
                <button
                  key={seat}
                  className={`btn btn-sm ${
                    selectedSeats.includes(seat) ? 'btn-success' : 'btn-outline'
                  }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Selected Seats Info */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-center">Selected Seats</h2>
          <p className="text-lg text-center">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
          </p>
          <p className="text-center">Total Seats: {selectedSeats.length}</p>
          <p className="text-center">Total Amount: ${selectedSeats.length * 10}</p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="btn bg-gray-300 text-gray-800 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`btn ${
              isBooking ? 'bg-gray-400' : 'bg-webcolor'
            } text-text-light hover:text-black border-none`}
            disabled={isBooking}
          >
            {isBooking ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapSeatModal;