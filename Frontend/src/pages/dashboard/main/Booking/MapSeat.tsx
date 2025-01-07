import React, { useState } from 'react';

const SeatMapPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seats = [
    ['A1', 'A2', 'A3', 'A4', 'A5'],
    ['B1', 'B2', 'B3', 'B4', 'B5'],
    ['C1', 'C2', 'C3', 'C4', 'C5'],
    ['D1', 'D2', 'D3', 'D4', 'D5'],
    ['E1', 'E2', 'E3', 'E4', 'E5'],
  ];

  const handleSeatClick = (seat) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((selected) => selected !== seat)
        : [...prevSelected, seat]
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-600">
      <div className="card w-96 bg-base-100 shadow-xl p-6 space-y-4">
        <h1 className="text-center text-3xl font-bold mb-4 text-primary">Seat Selection</h1>

        {/* Seat Grid */}
        <div className="grid grid-cols-5 gap-4">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-4">
              {row.map((seat) => (
                <button
                  key={seat}
                  className={`btn btn-sm ${selectedSeats.includes(seat) ? 'btn-success' : 'btn-outline'}`}
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

        {/* Payment Button */}
        <button type="submit" className="btn bg-webcolor text-text-light hover:text-black border-none w-full mt-4">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default SeatMapPage;