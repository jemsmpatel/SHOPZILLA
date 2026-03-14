import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import authReducer from './features/auth/authSlice';
import sellerAuthReducer from './features/seller/sellerauthSlice';
import adminAuthReducer from './features/admin/adminauthSlice';
import { apiSlice } from './api/apiSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        userAuth: authReducer,
        sellerAuth: sellerAuthReducer,
        adminAuth: adminAuthReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

setupListeners(store.dispatch);

export default store;