// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// ✅ Read stored user on load
const storedUser = JSON.parse(localStorage.getItem("user") || "null");

const initialState: AuthState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      const { user_id, first_name, last_name, email } = action.payload;
      state.user = { user_id, first_name, last_name, email };
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(state.user)); // ✅ Save updated user in localStorage
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user"); // ✅ Clear localStorage properly
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
