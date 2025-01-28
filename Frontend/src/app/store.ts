// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { usersAPI } from "../features/users/usersAPI";
import { loginAPI } from "../features/login/loginAPI";
import { bookingVehicleAPI } from "../features/booking/bookingAPI";
import userSlice from "../features/users/userSlice";
import { vehicleAPI } from "../features/vehicles/vehicleAPI";
import { ticketAPI } from "../features/tickets/ticketsAPI";
import { seatAPI } from "../features/seats/seatsAPI";
import { paymentAPI } from "../features/payments/paymentAPI";
import authSlice from "../features/auth/authslice"; // Import your auth slice

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // only user will be persisted
}

// Combine reducers
const rootReducer = combineReducers({
  [usersAPI.reducerPath]: usersAPI.reducer,
  [loginAPI.reducerPath]: loginAPI.reducer,
  [bookingVehicleAPI.reducerPath]: bookingVehicleAPI.reducer,
  [vehicleAPI.reducerPath]: vehicleAPI.reducer,
  [ticketAPI.reducerPath]: ticketAPI.reducer,
  [seatAPI.reducerPath]: seatAPI.reducer,
  [paymentAPI.reducerPath]: paymentAPI.reducer,
  // Add the auth reducer here
  auth: authSlice, // Add auth slice to the rootReducer
  user: userSlice,
});

// Add persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(usersAPI.middleware)
      .concat(vehicleAPI.middleware)
      .concat(ticketAPI.middleware)
      .concat(bookingVehicleAPI.middleware)
      .concat(seatAPI.middleware)
      .concat(paymentAPI.middleware)
      .concat(loginAPI.middleware),
});

export const persistedStore = persistStore(store);

// Define RootState type to include the 'auth' slice
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
