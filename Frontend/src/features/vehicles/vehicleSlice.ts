import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state type
type VehicleState = {
    selectedVehicle: vehicles | null;
    vehicle: vehicles[] | null;
};

// Define the vehicle type
type vehicles = {
    vehicle_id: number;
    vehicle_name: string;
    vehicle_description: string;
    vehicle_image: string;
    vehicle_link: string;
    created_at: string;
    updated_at: string;
};

// Helper function to safely parse localStorage
const parseLocalStorage = <T>(key: string, fallback: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
};

// Define the initial state
const initialState: VehicleState = {
    selectedVehicle: parseLocalStorage<vehicles | null>('selectedVehicle', null),
    vehicle: parseLocalStorage<vehicles[] | null>('vehicle', null),
};

// Create the slice
const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState: initialState,
    reducers: {
        setVehicle: (state, action: PayloadAction<vehicles[]>) => {
            state.vehicle = action.payload;
            localStorage.setItem('vehicle', JSON.stringify(action.payload));
        },
        updateVehicle: (state, action: PayloadAction<vehicles | null>) => {
            state.selectedVehicle = action.payload;
            localStorage.setItem('selectedVehicle', JSON.stringify(action.payload));
        },
        clearVehicle: (state) => {
            state.selectedVehicle = null;
            localStorage.removeItem('selectedVehicle');
        },
    },
});

export const { setVehicle, updateVehicle, clearVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
