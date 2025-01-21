import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../../types/types";

const initialState: UserState = {
    token: null,
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<UserState>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logOut(state) {
            state.token = null;
            state.user = null;
        }
    }
})

export const { loginSuccess, logOut } = userSlice.actions;
export default userSlice.reducer;

