import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary SDK
import { faker } from "@faker-js/faker";
import db from "./db";
import { routesTable, scheduleTable, vehicleTable } from "./schema";
import { generateDepartureTimes } from "../utils/Generateschedules";
import fetch from "node-fetch"; // Install node-fetch if using Node.js

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

// Unsplash API credentials
const UNSPLASH_ACCESS_KEY = "jGPIadk5uIFtd_MeQr-1jB9VLvf5GhmpsJFowviyx9Q"; // Replace with your Unsplash Access Key

// List of real locations (cities, towns, etc.)
const locations = [
  "Nairobi", "Mombasa", "Kisumu", "Eldoret", "Nakuru", "Thika", "Malindi", "Kakamega", 
  "Kitale", "Naivasha", "Nyeri", "Lamu", "Busia", "Lodwar", "Narok", "Embu", "Meru", 
  "Turkana", "Marsabit", "Kisii", "Isiolo", "Machakos", "Kiambu", "Garissa", "Wajir", 
  "Mandera", "Homa Bay", "Bungoma", "Voi", "Kitui", "Kericho", "Nyahururu", "Nanyuki", 
  "Ruiru", "Thika", "Kikuyu", "Limuru", "Athi River", "Karuri", "Ngong", "Kajiado", 
  "Molo", "Eldama Ravine", "Narok", "Sotik", "Bomet", "Keroka", "Nyamira", "Migori", 
  "Awendo", "Rongo", "Oyugis", "Kendu Bay", "Siaya", "Ugunja", "Bondo", "Yala", 
  "Mbita", "Suba", "Rusinga", "Mfangano", "Kapsabet", "Iten", "Kabarnet", "Marigat", 
  "Eldoret", "Burnt Forest", "Kapsowar", "Cheptongei", "Kapsokwony", "Kimilili", 
  "Webuye", "Bungoma", "Malaba", "Busia", "Mumias", "Butere", "Kakamega", "Vihiga", 
  "Luanda", "Mbale", "Chavakali", "Hamisi", "Serem", "Tiriki", "Sabatia", "Emuhaya", 
  "Kaimosi", "Cheptais", "Kapsokwony", "Kimilili", "Webuye", "Bungoma", "Malaba", 
  "Busia", "Mumias", "Butere", "Kakamega", "Vihiga", "Luanda", "Mbale", "Chavakali", 
  "Hamisi", "Serem", "Tiriki", "Sabatia", "Emuhaya", "Kaimosi", "Cheptais"
];

// List of real vehicle brands and models
const vehicleBrands = ["Toyota", "Ford", "Nissan", "Mercedes", "Volkswagen", "BMW", "Audi", "Subaru"];
const vehicleModels = ["Corolla", "Camry", "Ranger", "X-Trail", "C-Class", "Golf", "X5", "A4", "Outback"];

// Generate unique routes
const generateRoutes = (numRoutes: number) => {
  const routes = [];
  const usedPairs = new Set();

  while (routes.length < numRoutes) {
    const departure = faker.helpers.arrayElement(locations);
    const destination = faker.helpers.arrayElement(locations);

    if (departure !== destination && !usedPairs.has(`${departure}-${destination}`)) {
      usedPairs.add(`${departure}-${destination}`);

      routes.push({
        departure,
        destination,
        distance: faker.number.int({ min: 50, max: 1000 }),
        duration: faker.number.int({ min: 1, max: 12 }),
      });
    }
  }

  return routes;
};

// Function to fetch a random car image from Unsplash
const fetchRandomCarImage = async () => {
  const url = `https://api.unsplash.com/photos/random?query=car&client_id=${UNSPLASH_ACCESS_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const data = await response.json();
    return data.urls.regular; // Use the 'regular' size image URL
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null; // Return null or a fallback image URL
  }
};

// Generate random car image URL using Unsplash API
const generateRandomCarImageUrl = async (uniqueId: number) => {
  const imageUrl = await fetchRandomCarImage();
  return imageUrl || `https://source.unsplash.com/200x300/?car,${uniqueId}`; // Fallback to Unsplash Source URL
};

// Generate unique and realistic vehicle names
const generateVehicleName = () => {
  const brand = faker.helpers.arrayElement(vehicleBrands);
  const model = faker.helpers.arrayElement(vehicleModels);
  return `${brand} ${model}`;
};

const seedRoutes = async () => {
  try {
    console.log("🌱 Seeding routes table...");
    const routes = generateRoutes(50); // Generate 50 unique routes

    // Batch insert routes (e.g., 10 at a time)
    const batchSize = 10;
    for (let i = 0; i < routes.length; i += batchSize) {
      const batch = routes.slice(i, i + batchSize);
      await db.insert(routesTable).values(batch).execute();
      console.log(`✅ Inserted ${i + batch.length} routes...`);
    }

    console.log("✅ Seeded routes table successfully!");
  } catch (error) {
    console.error("❌ Error seeding routes table:", error);
    throw error; // Re-throw to stop the seeding process
  }
};

const seedSchedules = async () => {
  try {
    console.log("🌱 Seeding schedules table...");
    const routes = await db.query.routesTable.findMany();
    const schedules = [];

    for (const route of routes) {
      const departureTimes = generateDepartureTimes("06:00", "22:00", route.duration);
      for (const time of departureTimes) {
        schedules.push({
          route_id: route.route_id,
          departure_time: time,
          frequency: route.duration,
        });
      }
    }

    // Batch insert schedules (e.g., 10 at a time)
    const batchSize = 10;
    for (let i = 0; i < schedules.length; i += batchSize) {
      const batch = schedules.slice(i, i + batchSize);
      await db.insert(scheduleTable).values(batch).execute();
      console.log(`✅ Inserted ${i + batch.length} schedules...`);
    }

    console.log("✅ Seeded schedules table successfully!");
  } catch (error) {
    console.error("❌ Error seeding schedules table:", error);
    throw error; // Re-throw to stop the seeding process
  }
};

const seedVehicles = async () => {
  try {
    console.log("🌱 Seeding vehicles table...");
    const routes = await db.query.routesTable.findMany();
    const schedules = await db.query.scheduleTable.findMany();

    const vehicles = [];
    const numberOfVehicles = 7; // Number of vehicles to seed

    // Add a vehicle that matches all filter criteria
    const vehicleName = "Toyota Corolla";
    vehicles.push({
      registration_number: "KABC 123",
      vehicle_name: vehicleName,
      license_plate: "KABC 123",
      capacity: 25,
      vehicle_type: "SUV",
      cost: 2500,
      model_year: 2020,
      current_location: "Nairobi",
      departure: "Nairobi",
      departure_time: "08:00",
      destination: "Mombasa",
      route_id: routes[0].route_id,
      schedule_id: schedules[0].schedule_id,
      image_url: await generateRandomCarImageUrl(0),
    });

    for (let i = 1; i <= numberOfVehicles; i++) {
      const vehicleName = generateVehicleName();
      const route1 = routes[i % routes.length];
      const route2 = routes.find(
        (r) => r.departure === route1.destination && r.destination === route1.departure
      );

      const schedule1 = schedules[i % schedules.length];
      const schedule2 = schedules.find((s) => s.route_id === route2?.route_id);

      // Add vehicle for forward route
      vehicles.push({
        registration_number: `K${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 7) % 26))}${String.fromCharCode(65 + ((i + 14) % 26))} ${i}`,
        vehicle_name: vehicleName,
        license_plate: `K${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 7) % 26))}${String.fromCharCode(65 + ((i + 14) % 26))} ${i}`,
        capacity: 20 + (i % 10),
        vehicle_type: i % 4 === 0 ? "Bus" : i % 4 === 1 ? "Van" : i % 4 === 2 ? "MiniBus" : "SUV",
        cost: 800 + (i % 15) * 100,
        model_year: 2018 + (i % 7),
        current_location: route1.departure,
        departure: route1.departure,
        departure_time: schedule1.departure_time,
        destination: route1.destination,
        route_id: route1.route_id,
        schedule_id: schedule1.schedule_id,
        image_url: await generateRandomCarImageUrl(i),
      });

      // Add vehicle for reverse route (if it exists)
      if (route2 && schedule2) {
        const reverseVehicleName = generateVehicleName();
        vehicles.push({
          registration_number: `K${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 7) % 26))}${String.fromCharCode(65 + ((i + 14) % 26))} ${i + 1}`,
          vehicle_name: reverseVehicleName,
          license_plate: `K${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 7) % 26))}${String.fromCharCode(65 + ((i + 14) % 26))} ${i + 1}`,
          capacity: 20 + ((i + 1) % 10),
          vehicle_type: (i + 1) % 4 === 0 ? "Bus" : (i + 1) % 4 === 1 ? "Van" : (i + 1) % 4 === 2 ? "MiniBus" : "SUV",
          cost: 800 + ((i + 1) % 15) * 100,
          model_year: 2018 + ((i + 1) % 7),
          current_location: route2.departure,
          departure: route2.departure,
          departure_time: schedule2.departure_time,
          destination: route2.destination,
          route_id: route2.route_id,
          schedule_id: schedule2.schedule_id,
          image_url: await generateRandomCarImageUrl(i + 1),
        });
      }
    }

    // Batch insert vehicles (e.g., 100 at a time)
    const batchSize = 100;
    for (let i = 0; i < vehicles.length; i += batchSize) {
      const batch = vehicles.slice(i, i + batchSize);
      await db.insert(vehicleTable).values(batch).execute();
      console.log(`✅ Inserted ${i + batch.length} vehicles...`);
    }

    console.log("✅ Seeded vehicles table successfully!");
  } catch (error) {
    console.error("❌ Error seeding vehicles table:", error);
    throw error; // Re-throw to stop the seeding process
  }
};

const clearDatabase = async () => {
  try {
    console.log("🧹 Clearing existing data...");

    // Delete all rows from the tables
    await db.delete(vehicleTable).execute();
    await db.delete(scheduleTable).execute();
    await db.delete(routesTable).execute();

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error; // Re-throw to stop the seeding process
  }
};

const seedDatabase = async () => {
  try {
    console.log("🚀 Starting database seeding...");

    // Clear existing data
    await clearDatabase();

    // Seed fresh data
    await seedRoutes();
    await seedSchedules();
    await seedVehicles();

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0); // Exit the process after seeding
  }
};

seedDatabase();