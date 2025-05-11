import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import transactionReducer from "./transactions/transactionSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transaction: transactionReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
