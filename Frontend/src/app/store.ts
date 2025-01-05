import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { usersAPI } from "../features/users/usersAPI";
import { loginAPI } from "../features/login/loginAPI";
import userSlice from "../features/users/userSlice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'], // only user will be persisted
}

// combine reducers
const rootReducer = combineReducers({
    [usersAPI.reducerPath]: usersAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
    // add other reducers here
    user: userSlice,
});
// add persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


// create store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(usersAPI.middleware).concat(usersAPI.middleware).concat(usersAPI.middleware,
        loginAPI.middleware
    ),
});

export const persistedStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
