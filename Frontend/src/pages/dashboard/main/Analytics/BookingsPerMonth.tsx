import { useEffect, useState } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { bookingVehicleAPI, Tbooking } from '../../../../features/booking/bookingAPI';

interface ChartData {
    name: string;
    bookings: number;
}

const BookingsPerMonth = () => {
    const { data: bookings } = bookingVehicleAPI.useGetBookingVehicleQuery();
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (bookings) {
            const bookingsByMonth = bookings.reduce((acc: { [key: string]: number }, booking: Tbooking) => {
                const monthYear = new Date(booking.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                acc[monthYear] = (acc[monthYear] || 0) + 1;
                return acc;
            }, {});

            const data = Object.keys(bookingsByMonth).map(key => ({
                name: key,
                bookings: bookingsByMonth[key],
            })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

            setChartData(data);
        }
    }, [bookings]);

    return (
        <div className='bg-gray-100 p-6 rounded-lg shadow-lg'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Seat Reservations Over Time</h2>
                <div className='w-full h-80'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} />
                            <Legend />
                            <Bar dataKey="bookings" fill="#4f46e5" barSize={50} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default BookingsPerMonth;