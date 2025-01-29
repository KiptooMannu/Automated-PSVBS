import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

export interface Vehicle {
  registration_number: string;
  vehicle_name: string;
  license_plate: string;
  capacity: number;
  vehicle_type: string;
  model_year?: number;
  cost: number;
  current_location: string;
  is_active: boolean;
  image_url: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  booked_Seats?: number;
  departure:string;
  destination:string;  
  
}

export const vehicleAPI = createApi({
  reducerPath: "vehiclesAPI",
  baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
  refetchOnReconnect: true,
  tagTypes: ["Vehicles"], 
  endpoints: (builder) => ({
    fetchCarSpecs: builder.query<Vehicle[], void>({
      query: () => "vehicles", 
      providesTags: ["Vehicles"],
    }),
    createVehicle: builder.mutation<Vehicle, Partial<Vehicle>>({
      query: (newVehicle) => ({
        url: "vehicles",
        method: "POST",
        body: newVehicle,
      }),
      invalidatesTags: ["Vehicles"], // Consistent tag invalidation
    }),
    updateVehicle: builder.mutation<
      Vehicle,
      Partial<Vehicle & { registration_number: string }>
    >({
      query: ({ registration_number, ...rest }) => ({
        url: `vehicles/${registration_number}`, // Fixed parameter usage
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    deleteVehicle: builder.mutation<{ success: boolean }, string>({
      query: (registration_number) => ({
        url: `vehicles/${registration_number}`, // Updated to use registration_number
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicles"],
    }),
    getVehicleById: builder.query<Vehicle, string>({
      query: (registration_number) => `vehicles${registration_number}`, // Fixed endpoint
      providesTags: ["Vehicles"],
    }),
  }),
});

export const {
  useFetchCarSpecsQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetVehicleByIdQuery,
} = vehicleAPI;