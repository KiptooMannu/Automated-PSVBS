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
  departure: string;
  destination: string;
  price: number;
  departure_date: string;
  departure_time: string;
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
      transformResponse: (response: Vehicle[]) => {
        // ✅ Remove duplicate vehicles based on registration_number
        return Array.from(new Map(response.map(vehicle => [vehicle.registration_number, vehicle])).values());
      },
    }),

    createVehicle: builder.mutation<Vehicle, Partial<Vehicle>>({
      query: (newVehicle) => ({
        url: "vehicles",
        method: "POST",
        body: newVehicle,
      }),
      invalidatesTags: ["Vehicles"],
      async onQueryStarted(newVehicle, { dispatch, queryFulfilled }) {
        console.log("🚀 Creating vehicle:", newVehicle); // ✅ Debugging - Mark newVehicle as used

        try {
          const { data: createdVehicle } = await queryFulfilled;

          // ✅ Ensure the new vehicle is not duplicated in the cache
          dispatch(
            vehicleAPI.util.updateQueryData("fetchCarSpecs", undefined, (draft) => {
              const uniqueVehicles = new Map(draft.map(v => [v.registration_number, v]));
              uniqueVehicles.set(createdVehicle.registration_number, createdVehicle);
              return Array.from(uniqueVehicles.values());
            })
          );
        } catch (err) {
          console.error("Error ensuring unique vehicles:", err);
        }
      },
    }),

    updateVehicle: builder.mutation<
      Vehicle,
      Partial<Vehicle & { registration_number: string }>
    >({
      query: ({ registration_number, ...rest }) => ({
        url: `vehicles/${registration_number}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Vehicles"],
    }),

    deleteVehicle: builder.mutation<{ success: boolean }, string>({
      query: (registration_number) => ({
        url: `vehicles/${registration_number}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicles"],
    }),

    getVehicleById: builder.query<Vehicle, string>({
      query: (registration_number) => `vehicles/${registration_number}`,
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
