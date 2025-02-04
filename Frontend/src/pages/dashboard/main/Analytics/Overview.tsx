// import { usersAPI } from "../../../../features/users/usersAPI"
// import { useEffect, useState } from 'react';



// const Overview = () => {
// const {data: usersData,isLoading: usersLoading, error: usersError} = usersAPI.useGetUsersQuery();
// console.log(usersData);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalVehicles, setTotalVehicles] = useState(0);
//   const [totalReservation, setTotalReservation] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);

//   useEffect(() => {
//     if (usersData) {
//       const usersCount = usersData.length;


//       //  Animation for counting numbers
//       const duration = 1000;
//       const steps = 30;
//       const usersStep = usersCount / steps;
      
//       let currentUsers = 0;
//       let currentCustomers = 0;
//       let currentAdmins = 0;

//       const interval = setInterval(() => {
//         currentUsers = Math.min(currentUsers + usersStep, usersCount);


//         setTotalUsers(Math.floor(currentUsers));


//         if (currentUsers >= usersCount && currentCustomers >= customersCount && currentAdmins >= adminsCount) {
//           clearInterval(interval);
//         }
//       }, duration / steps);

//       return () => clearInterval(interval);
//     }
//   },[]);

//   if (usersLoading) {
//     return <div>Loading...</div>;
//   }

//   if (usersError) {
//     return <div>Error loading users</div>;
//   }

//   return (
//     <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
//         <h3 className="text-lg font-semibold">Total Users</h3>
//         <div className="text-4xl font-bold animate-pulse"></div>
//         <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mt-2"></div>
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
//         <h3 className="text-lg font-semibold">Total Vehicles</h3>
//         <div className="text-4xl font-bold animate-pulse"></div>
//         <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mt-2"></div>
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
//         <h3 className="text-lg font-semibold">Total Reservations</h3>
//         <div className="text-4xl font-bold animate-pulse"></div>
//         <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mt-2"></div>
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
//         <h3 className="text-lg font-semibold">Revenue Generated</h3>
//         <div className="text-4xl font-bold animate-pulse"></div>
//         <div className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center mt-2"></div>
//       </div>

//     </div>
//   )
// }

// export default Overview

import { usersAPI } from "../../../../features/users/usersAPI";
import { useEffect, useState } from "react";

const Overview = () => {
  const { data: usersData, isLoading: usersLoading, error: usersError } = usersAPI.useGetUsersQuery();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (usersData) {
      const usersCount = usersData.length;
      const vehiclesCount = Math.floor(usersCount * 1.5); // Example: assume each user owns 1.5 vehicles
      const reservationsCount = Math.floor(usersCount * 2); // Example: assume each user makes 2 reservations
      const revenueGenerated = reservationsCount * 50; // Example: each reservation generates $50

      // Animation for counting numbers
      const duration = 1000;
      const steps = 30;
      const usersStep = usersCount / steps;
      const vehiclesStep = vehiclesCount / steps;
      const reservationsStep = reservationsCount / steps;
      const revenueStep = revenueGenerated / steps;

      let currentUsers = 0;
      let currentVehicles = 0;
      let currentReservations = 0;
      let currentRevenue = 0;

      const interval = setInterval(() => {
        currentUsers = Math.min(currentUsers + usersStep, usersCount);
        currentVehicles = Math.min(currentVehicles + vehiclesStep, vehiclesCount);
        currentReservations = Math.min(currentReservations + reservationsStep, reservationsCount);
        currentRevenue = Math.min(currentRevenue + revenueStep, revenueGenerated);

        setTotalUsers(Math.floor(currentUsers));
        setTotalVehicles(Math.floor(currentVehicles));
        setTotalReservations(Math.floor(currentReservations));
        setTotalRevenue(Math.floor(currentRevenue));

        if (
          currentUsers >= usersCount &&
          currentVehicles >= vehiclesCount &&
          currentReservations >= reservationsCount &&
          currentRevenue >= revenueGenerated
        ) {
          clearInterval(interval);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [usersData]); // Dependency array added

  if (usersLoading) {
    return <div>Loading...</div>;
  }

  if (usersError) {
    return <div>Error loading users</div>;
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Users */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Total Users</h3>
        <div className="text-4xl font-bold">{totalUsers}</div>
        <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mt-2">👤</div>
      </div>

      {/* Total Vehicles */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Total Vehicles</h3>
        <div className="text-4xl font-bold">{totalVehicles}</div>
        <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mt-2">🚗</div>
      </div>

      {/* Total Reservations */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Total Reservations</h3>
        <div className="text-4xl font-bold">{totalReservations}</div>
        <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mt-2">📅</div>
      </div>

      {/* Revenue Generated */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Revenue Generated</h3>
        <div className="text-4xl font-bold">${totalRevenue.toLocaleString()}</div>
        <div className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center mt-2">💰</div>
      </div>
    </div>
  );
};

export default Overview;
